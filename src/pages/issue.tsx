import axios from "axios";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";

import { IssueTemplate } from "../components/templates/Issue";
import { COOKIE_VC_REQUEST_KEY } from "../configs/constants";
import { getAndRefreshAuthorizationContext } from "../lib/oidc";
import { AcquiredAttestation, Manifest } from "../types";

interface IssuePageProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

const IssuePage: React.FC<IssuePageProps> = ({ manifest, acquiredAttestation }) => {
  return <IssueTemplate manifest={manifest} acquiredAttestation={acquiredAttestation} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const vcRequestString = parseCookies(ctx)[COOKIE_VC_REQUEST_KEY];
  if (!vcRequestString) {
    return {
      redirect: {
        destination: "/scanner",
        permanent: false,
      },
    };
  }
  const vcRequest = JSON.parse(vcRequestString);
  const { idTokenKey, idTokenState } = getAndRefreshAuthorizationContext(ctx);
  const acquiredAttestation = {};
  if (ctx.query.code) {
    if (!ctx.query.state || ctx.query.state !== idTokenState) {
      return {
        redirect: {
          destination: "/scanner",
          permanent: false,
        },
      };
    }
    acquiredAttestation[idTokenKey] = ctx.query.code;
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
