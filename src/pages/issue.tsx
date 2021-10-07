import React from "react";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import { IssueTemplate } from "../components/templates/Issue";
import { COOKIE_VC_REQUEST_KEY, COOKIE_ID_TOKEN_STATE, COOKIE_ID_TOKEN_KEY } from "../configs/constants";

import { Manifest, AcquiredAttestation } from "../types";

interface IssuePageProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

const IssuePage: React.FC<IssuePageProps> = ({ manifest, acquiredAttestation }) => {
  return <IssueTemplate manifest={manifest} acquiredAttestation={acquiredAttestation} />;
};

export const getServerSideProps = async (ctx) => {
  const vcRequestString = parseCookies(ctx)[COOKIE_VC_REQUEST_KEY];
  if (!vcRequestString) {
    return {
      redirect: {
        destination: "/scanner",
        permanent: false,
      },
    };
  }
  // destroyCookie(ctx, COOKIE_VC_REQUEST_KEY);
  const vcRequest = JSON.parse(vcRequestString);

  let acquiredAttestation = {};
  if (ctx.query.code) {
    const cookieState = parseCookies(ctx)[COOKIE_ID_TOKEN_STATE];
    // destroyCookie(ctx, COOKIE_ID_TOKEN_STATE);
    if (!ctx.query.state || ctx.query.state !== cookieState) {
      return {
        redirect: {
          destination: "/scanner",
          permanent: false,
        },
      };
    }
    const cookieIdTokenKey = parseCookies(ctx)[COOKIE_ID_TOKEN_KEY];
    // destroyCookie(ctx, COOKIE_ID_TOKEN_KEY);
    acquiredAttestation[cookieIdTokenKey] = ctx.query.code;
  }

  const manifestUrl = vcRequest.presentation_definition.input_descriptors[0].issuance[0].manifest;
  const manifestResponse = await axios.get(manifestUrl);
  const { data: manifest } = manifestResponse;
  return {
    props: {
      manifest,
      acquiredAttestation: acquiredAttestation,
    },
  };
};

export default IssuePage;
