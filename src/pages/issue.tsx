import axios from "axios";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";

import { IssueTemplate } from "../components/templates/Issue";
import { COOKIE_VC_REQUEST_KEY } from "../configs/constants";
import { getAndRefreshAuthorizationContext } from "../lib/oidc";
import { AcquiredIdToken, Manifest, VCRequest } from "../types";

interface IssuePageProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredIdToken;
}

const IssuePage: React.FC<IssuePageProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  return <IssueTemplate vcRequest={vcRequest} manifest={manifest} acquiredAttestation={acquiredAttestation} />;
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
  const { idTokenKey, idTokenState, codeVerifier } = getAndRefreshAuthorizationContext(ctx);
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
    const tokenEndpoint = await axios.get(idTokenKey).then((resp) => resp.data.token_endpoint as any);
    const idToken = await axios
      .get(
        `${tokenEndpoint}&grant_type=authorization_code&code=${ctx.query.code}&code_verifier=${codeVerifier}&client_id=42b66b31-3b4f-4f50-a8af-a2632a03b669`
      )
      .then((resp) => resp.data);
    acquiredAttestation[idTokenKey] = idToken;
  }

  const manifestUrl = vcRequest.presentation_definition.input_descriptors[0].issuance[0].manifest;
  const manifestResponse = await axios.get(manifestUrl);
  const { data: manifest } = manifestResponse;
  return {
    props: {
      vcRequest,
      manifest,
      acquiredAttestation: acquiredAttestation,
    },
  };
};

export default IssuePage;
