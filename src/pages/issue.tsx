import React from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { IssueTemplate } from "../components/templates/Issue";
import { COOKIE_VC_REQUEST_KEY, COOKIE_ID_TOKEN_STATE, COOKIE_ID_TOKEN_KEY } from "../lib/constants";

import { Manifest, AcquiredAttestation } from "../lib/types";

interface IssuePageProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

const IssuePage: React.FC<IssuePageProps> = ({ manifest, acquiredAttestation }) => {
  return <IssueTemplate manifest={manifest} acquiredAttestation={acquiredAttestation} />;
};

export const getServerSideProps = async (ctx) => {
  let acquiredAttestation = {};
  if (ctx.query.code) {
    if (!ctx.query.state) {
      throw new Error("state is invalid");
    }
    const cookieState = parseCookies(ctx)[COOKIE_ID_TOKEN_STATE];
    if (ctx.query.state !== cookieState) {
      throw new Error("state is invalid");
    }
    const cookieTokenId = parseCookies(ctx)[COOKIE_ID_TOKEN_KEY];
    acquiredAttestation[cookieTokenId] = ctx.query.code;
  }
  const vcRequest = JSON.parse(parseCookies(ctx)[COOKIE_VC_REQUEST_KEY]);
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
