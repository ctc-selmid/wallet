import { Box, Button, Flex, Grid, Icon, Link, Text } from "@chakra-ui/react";
import { BadgeCheckIcon, ChevronRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import React from "react";

import { COOKIE_VC_REQUEST_KEY } from "../../configs/constants";
import { useSigner } from "../../hooks/useSigner";
import { proxyHttpRequest } from "../../lib/http";
import { authorize } from "../../lib/oidc";
import { saveVC } from "../../lib/repository/vc";
import { AcquiredIdToken, IdTokenConfiguration, Manifest, RequiredToken, VCRequest } from "../../types";
import { CredentialCard } from "../molecules/CredentialCard";

export interface IssueProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredIdToken;
}

// TODO: redirectUriを動的に設定する
export const Issue: React.FC<IssueProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  const router = useRouter();
  const { signer } = useSigner();

  const getIdToken = async (RequiredToken: RequiredToken) => {
    const idTokenConfigulation = await proxyHttpRequest<IdTokenConfiguration>("get", RequiredToken.configuration);
    const redirectUri = RequiredToken.redirect_uri ? RequiredToken.redirect_uri : "https://wallet-selmid.vercel.app/";

    authorize({
      key: RequiredToken.configuration,
      authorizationEndpoint: idTokenConfigulation.authorization_endpoint,
      clientId: RequiredToken.client_id,
      redirectUri,
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

    saveVC(vcRequest.presentation_definition.input_descriptors[0].issuance[0].manifest, { jwt: vc, manifest });
    // destroyCookie(null, COOKIE_VC_REQUEST_KEY);
    router.push("/");
  };

  return (
    <Box>
      <Box mb="8">
        <Text textAlign="center" fontSize="3xl" fontWeight="bold">
          Add a credential
        </Text>
      </Box>
      <Box px="4" mb="8">
        <CredentialCard card={manifest.display.card} />
      </Box>
      <Box mb="8">
        {manifest.input.attestations.idTokens.map((idToken, i) => {
          const { host } = new URL(idToken.configuration);
          const fulfilled = acquiredAttestation && acquiredAttestation[idToken.configuration] !== undefined;
          const bg = fulfilled ? "gray.50" : "blue.50";
          const cursor = fulfilled ? undefined : "pointer";
          const onclick = fulfilled ? undefined : () => getIdToken(idToken);

          return (
            <Flex
              key={i}
              bg={bg}
              py="6"
              px="4"
              cursor={cursor}
              justifyContent="space-between"
              alignItems="center"
              disabled={fulfilled}
              onClick={onclick}
            >
              <Box>
                <Text fontSize="lg" fontWeight="bold">
                  Sign in to your account {fulfilled && <Icon w="4" h="4" color="green.400" as={BadgeCheckIcon} />}
                </Text>
                <Text fontSize="sm">{host}</Text>
              </Box>
              {!fulfilled && <Icon w="4" h="4" as={ChevronRightIcon} />}
            </Flex>
          );
        })}
      </Box>
      <Box px="4">
        <Grid templateColumns="repeat(2, 1fr)" gap="4">
          <Link href="/">
            <Button w="100%">Cancel</Button>
          </Link>
          <Button
            disabled={Object.keys(acquiredAttestation).length < manifest.input.attestations.idTokens.length}
            onClick={issueVC}
            colorScheme="blue"
          >
            Submit
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};
