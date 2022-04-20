import { Box, Button, Center, Flex, Grid, Icon, Link, Progress, Spinner, Text } from "@chakra-ui/react";
import { BadgeCheckIcon, ChevronRightIcon } from "@heroicons/react/outline";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

import { useSigner } from "../../hooks/useSigner";
import { proxyHttpRequest } from "../../lib/http";
import { authorize } from "../../lib/oidc";
import { saveVC } from "../../lib/repository/vc";
import { getVCTypeFromJWT } from "../../lib/utils";
import { AcquiredIdToken, IdTokenConfiguration, Manifest, RequiredToken, VCRequest } from "../../types";
import { CredentialCard } from "../molecules/CredentialCard";

const PinInput = dynamic(() => import("react-pin-input"), { ssr: false });

export interface IssueProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredIdToken;
}

// TODO: redirectUriを動的に設定する
// TODO: https://wallet-selmid.vercel.app/issueに変更
export const Issue: React.FC<IssueProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  const router = useRouter();
  const { signer } = useSigner();
  const [isLoading, setIsLoading] = React.useState(false);

  const [pinStatus, setPinStatus] = React.useState<undefined | "success" | "no entered">(undefined);

  React.useEffect(() => {
    setPinStatus("no entered");
  }, [manifest]);

  const getIdToken = async (RequiredToken: RequiredToken) => {
    const idTokenConfigulation = await proxyHttpRequest<IdTokenConfiguration>("get", RequiredToken.configuration);
    const redirectUri = RequiredToken.redirect_uri ? RequiredToken.redirect_uri : "https://wallet-selmid.vercel.app";

    authorize({
      key: RequiredToken.configuration,
      authorizationEndpoint: idTokenConfigulation.authorization_endpoint,
      clientId: RequiredToken.client_id,
      redirectUri,
    });
  };

  const issueVC = async () => {
    setIsLoading(true);
    const issueRequestIdToken = await signer.siop({
      aud: manifest.input.credentialIssuer,
      contract: manifest.display.contract,
      attestations: acquiredAttestation,
    });
    try {
      const issueResponse = await axios.post(manifest.input.credentialIssuer, issueRequestIdToken, {
        headers: { "Content-Type": "text/plain" },
      });
      const { data } = issueResponse;
      const { vc } = data as unknown as { vc: string };
      const vcType = getVCTypeFromJWT(vc);

      // TODO: formatは動的に設定する
      saveVC(vcRequest.presentation_definition.input_descriptors[0].issuance[0].manifest, {
        format: "jwt_vc",
        vc: vc,
        manifest,
        type: vcType,
      });
      router.push({ pathname: "/result", query: { type: "issue", result: "true" } });
    } catch (e) {
      router.push({ pathname: "/result", query: { type: "issue", result: "false", errorMessage: e } });
      console.log(e);
    }
  };

  return (
    <Box>
      {isLoading ? <Progress size="xs" isIndeterminate /> : <Box paddingTop="4px"></Box>}
      <Box mb="8">
        <Text textAlign="center" fontSize="3xl" fontWeight="bold">
          Add a credential
        </Text>
      </Box>
      {manifest && acquiredAttestation ? (
        manifest &&
        acquiredAttestation && (
          <>
            <Box px="4" mb="8">
              <CredentialCard card={manifest.display.card} />
            </Box>
            <Box mb="8">
              {manifest.input.attestations.idTokens.map((idToken, i) => {
                const { host } = new URL(idToken.configuration);

                if (idToken.configuration === "https://self-issued.me") {
                  return <div key={i}></div>;
                }
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
                    onClick={onclick}
                    _disabled={{ opacity: 0.6 }}
                    // TODO: Sign in が終わっていたらdisabledにする
                    // disabled={fulfilled}
                  >
                    <Box>
                      <Text fontSize="lg" fontWeight="bold">
                        Sign in to your account{" "}
                        {fulfilled && <Icon w="4" h="4" color="green.400" as={BadgeCheckIcon} />}
                      </Text>
                      <Text fontSize="sm">{host}</Text>
                    </Box>
                    {!fulfilled && <Icon w="4" h="4" as={ChevronRightIcon} />}
                  </Flex>
                );
              })}
            </Box>
            {pinStatus && (
              <Box>
                <Text textAlign="center" fontSize="lg" fontWeight="bold">
                  Input Pin Code
                </Text>
                <Box p={3}>
                  <Center>
                    <PinInput
                      length={4}
                      initialValue=""
                      type="numeric"
                      inputMode="number"
                      onChange={(value, index) => {
                        if (value === "1234") {
                          setPinStatus("success");
                        } else {
                          setPinStatus("no entered");
                        }
                      }}
                    ></PinInput>
                  </Center>
                </Box>
              </Box>
            )}

            <Box px="4">
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <Link href="/">
                  <Button w="100%">Cancel</Button>
                </Link>
                <Button
                  disabled={
                    Object.keys(acquiredAttestation).length < manifest.input.attestations.idTokens.length ||
                    pinStatus === "no entered"
                  }
                  onClick={issueVC}
                  colorScheme="blue"
                >
                  Submit
                </Button>
              </Grid>
            </Box>
          </>
        )
      ) : (
        <>
          <Center>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"></Spinner>
          </Center>
        </>
      )}
    </Box>
  );
};
