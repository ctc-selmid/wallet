import React from "react";
import { useRouter } from "next/router";
import { Box, Button } from "@chakra-ui/react";

import { setCookie } from "nookies";
import { Credential } from "../molecules/Credential";

import { Manifest, IdTokenConfiguration, RequiredToken, AcquiredAttestation } from "../../types";

// import {
//   generateCodeVerifier,
//   sha256,
//   generateOpenIdConnectState,
//   proxyHttpRequest,
// } from "../../lib/repository/keyPair";

import ION from "@decentralized-identity/ion-tools";

import { sha256 } from "../../lib/hash";

import { generateState, generateCodeVerifier } from "../../lib/open-id-connect";
import { getCreateDidParam, generateSiopHeader, generateSiopPayload } from "../../lib/utils";

import { proxyHttpRequest } from "../../lib/http";
import { COOKIE_ID_TOKEN_CODE_VERIFIER, COOKIE_ID_TOKEN_KEY, COOKIE_ID_TOKEN_STATE } from "../../configs/constants";
import { useKeyPair } from "../../hooks/useLocalStorageWallet";
import axios from "axios";

export interface IssueProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

export const Issue: React.FC<IssueProps> = ({ manifest, acquiredAttestation }) => {
  const router = useRouter();
  const { keyPair } = useKeyPair();

  const getIdToken = async (RequiredToken: RequiredToken) => {
    console.log(RequiredToken);
    const idTokenConfigulation = await proxyHttpRequest<IdTokenConfiguration>("get", RequiredToken.configuration);
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = sha256(codeVerifier);
    setCookie(null, COOKIE_ID_TOKEN_STATE, state);
    setCookie(null, COOKIE_ID_TOKEN_CODE_VERIFIER, codeVerifier);
    setCookie(null, COOKIE_ID_TOKEN_KEY, RequiredToken.id);
    const authorizationUri = `${idTokenConfigulation.authorization_endpoint}?redirect_uri=${RequiredToken.redirect_uri}&client_id=${RequiredToken.client_id}&response_type=code&scope=openid&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    router.push(authorizationUri);
  };

  const getVC = async () => {
    const { publicJwk } = keyPair;
    const did = new ION.DID(getCreateDidParam(publicJwk));
    const longFormDid = await did.getURI();

    const payload = {
      aud: manifest.input.credentialIssuer,
      contract: manifest.display.contract,
      attestations: acquiredAttestation,
    };

    const jws = await ION.signJws({
      payload: await generateSiopPayload({ payload, longFormDid, publicJwk }),
      header: generateSiopHeader(longFormDid),
      privateJwk: keyPair.privateJwk,
    });

    console.log(jws);
    await axios.post(manifest.input.credentialIssuer, jws, {
      headers: { "Content-Type": "text/plain" },
    });
    // await proxyHttpRequest("post", manifest.input.credentialIssuer, jws);
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
