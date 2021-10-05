import React from "react";
import { useRouter } from "next/router";
import { Box, Button } from "@chakra-ui/react";

import { setCookie } from "nookies";
import { Credential } from "../molecules/Credential";

import { Manifest, IdTokenConfiguration, RequiredToken, AcquiredAttestation } from "../../lib/types";
import { generateCodeVerifier, generateHash, generateState, proxyHttpRequest } from "../../lib/utils";
import { COOKIE_ID_TOKEN_CODE_VERIFIER, COOKIE_ID_TOKEN_KEY, COOKIE_ID_TOKEN_STATE } from "../../lib/constants";

export interface IssueProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

export const Issue: React.FC<IssueProps> = ({ manifest, acquiredAttestation }) => {
  const router = useRouter();

  const getIdToken = async (RequiredToken: RequiredToken) => {
    console.log(RequiredToken);
    const idTokenConfigulation = await proxyHttpRequest<IdTokenConfiguration>("get", RequiredToken.configuration);
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateHash("sha256", codeVerifier);
    setCookie(null, COOKIE_ID_TOKEN_STATE, state);
    setCookie(null, COOKIE_ID_TOKEN_CODE_VERIFIER, codeVerifier);
    setCookie(null, COOKIE_ID_TOKEN_KEY, RequiredToken.id);
    const authorizationUri = `${idTokenConfigulation.authorization_endpoint}?redirect_uri=${RequiredToken.redirect_uri}&client_id=${RequiredToken.client_id}&response_type=code&scope=openid&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    router.push(authorizationUri);
  };

  const getVC = async () => {
    console.log("get vc");
  };

  return (
    <Box>
      <Credential card={manifest.display.card} />
      {manifest.input.attestations.idTokens.map((idToken, i) => {
        return (
          <Box key={i}>
            <Button disabled={acquiredAttestation[idToken.id]} onClick={() => getIdToken(idToken)}>
              {idToken.id}
            </Button>
          </Box>
        );
      })}
      <Button
        disabled={Object.keys(acquiredAttestation).length < manifest.input.attestations.idTokens.length}
        onClick={getVC}
      >
        Submit
      </Button>
    </Box>
  );
};
