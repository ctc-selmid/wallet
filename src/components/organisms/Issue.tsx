import { Box, Button } from "@chakra-ui/react";
import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import React from "react";

import { COOKIE_VC_REQUEST_KEY } from "../../configs/constants";
import { useSigner } from "../../hooks/useSigner";
import { proxyHttpRequest } from "../../lib/http";
import { authorize } from "../../lib/oidc";
import { getVC, saveVC } from "../../lib/repository/vc";
import { AcquiredAttestation, IdTokenConfiguration, Manifest, RequiredToken } from "../../types";
import { Credential } from "../molecules/Credential";

export interface IssueProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

export const Issue: React.FC<IssueProps> = ({ manifest, acquiredAttestation }) => {
  const router = useRouter();
  const { signer } = useSigner();

  const getIdToken = async (RequiredToken: RequiredToken) => {
    const idTokenConfigulation = await proxyHttpRequest<IdTokenConfiguration>("get", RequiredToken.configuration);
    authorize({
      key: RequiredToken.id,
      authorizationEndpoint: idTokenConfigulation.authorization_endpoint,
      clientId: RequiredToken.client_id,
      redirectUri: RequiredToken.redirect_uri,
    });
  };

  const issueVC = async () => {
    const issueRequestIdToken = await signer.siop({
      aud: manifest.input.credentialIssuer,
      contract: manifest.display.contract,
      attestations: acquiredAttestation,
    });
    const issueResponse = await axios.post(manifest.input.credentialIssuer, issueRequestIdToken, {
      headers: { "Content-Type": "text/plain" },
    });
    const { data } = issueResponse;
    const { vc } = data as unknown as { vc: string };
    saveVC(manifest.display.contract, vc);
    destroyCookie(null, COOKIE_VC_REQUEST_KEY);
    router.push("/");
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
        onClick={issueVC}
      >
        Submit
      </Button>
    </Box>
  );
};
