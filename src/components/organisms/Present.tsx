import { Box, Button, Grid, Link, Progress, Text } from "@chakra-ui/react";
import ION from "@decentralized-identity/ion-tools";
import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import moment from "moment";
import NextLink from "next/link";
import { useRouter } from "next/router";
import qs from "querystring";
import React from "react";

import { useSigner } from "../../hooks/useSigner";
import { getVC } from "../../lib/repository/vc";
import { Signer } from "../../lib/signer";
import { Manifest, VCRequest } from "../../types";
import { SelectVC } from "../molecules/SelectVC";

export interface PresentProps {
  vcRequest: VCRequest;
  manifest: Manifest;
}

export const Present: React.FC<PresentProps> = ({ manifest, vcRequest }) => {
  const { signer } = useSigner();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const [presentationVCID, setPresentationVCID] = React.useState<string[]>([]);

  const descriptor_map: [{ id?: string; path?: string; encoding?: string; format?: string }?] = [];

  let pairWiseDidSigner = undefined;

  const presentVC = async () => {
    setIsLoading(true);
    /** VCにexchangeServiceがある場合 VC exchangeをする */
    const vcs = [];
    for (let i = 0; presentationVCID.length > i; i++) {
      const key = presentationVCID[i];
      const vc = getVC(key);
      const decoded = jsonwebtoken.decode(vc.vc) as any;

      if (decoded["vc"]["exchangeService"]["id"] !== undefined) {
        const exchangeService = decoded.vc.exchangeService.id;
        const pairWiseDidKeyPair = await ION.generateKeyPair();
        pairWiseDidSigner = new Signer();
        await pairWiseDidSigner.init(pairWiseDidKeyPair);

        const exchangeRequestIdToken = await signer.siop({
          aud: exchangeService,
          contract: manifest?.display?.contract,
          recipient: pairWiseDidSigner.did,
          vc: vc.vc,
        });
        const exchangeResponse = await axios.post(exchangeService, exchangeRequestIdToken, {
          headers: { "Content-Type": "text/plain" },
        });
        const { vc: exchangedVC } = exchangeResponse.data as unknown as { vc: string };
        vc.vc = exchangedVC;
      }
      vcs.push(vc.vc);
      descriptor_map.push({
        path: `$.attestations.presentations.${vcRequest.presentation_definition.input_descriptors[0].id}`,
        id: `${vcRequest.presentation_definition.input_descriptors[i].id}`,
        encoding: "base64Url",
        format: vc.format === "jwt_vc" ? "JWT" : "JSON-LD",
      });
    }

    const vp = await pairWiseDidSigner.createVP(vcs, vcRequest.iss);

    const attestations = {
      presentations: { sclvc: vp },
    };

    const verifyRequestIdToken = pairWiseDidSigner
      ? await pairWiseDidSigner.siop({
          aud: vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
          nonce: vcRequest.nonce,
          state: vcRequest.state,
          attestations,
          presentation_submission: {
            descriptor_map,
          },
          nbf: moment().unix(),
        })
      : await signer.siop({
          aud: vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
          nonce: vcRequest.nonce,
          state: vcRequest.state,
          attestations,
          presentation_submission: {
            descriptor_map,
          },
          nbf: moment().unix(),
        });

    try {
      await axios.post(
        vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
        qs.stringify({
          id_token: verifyRequestIdToken,
          state: vcRequest.state,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      router.push({ pathname: "/result", query: { type: "present", result: "true" } });
    } catch (e) {
      router.push({ pathname: "/result", query: { type: "present", result: "false", errorMessage: e } });
      console.log("ERROR: " + e.message);
    }
  };

  return (
    <Box>
      {isLoading ? <Progress size="xs" isIndeterminate /> : <Box paddingTop="4px"></Box>}
      <Box mb="8">
        <Text textAlign="center" fontSize="3xl" fontWeight="bold">
          New Permission Request
        </Text>
      </Box>
      <Box px="2" mb="8"></Box>
      <Box paddingBottom={3}>
        {vcRequest && (
          <SelectVC
            vcRequest={vcRequest}
            presentationVCID={presentationVCID}
            setPresentationVCID={setPresentationVCID}
          />
        )}
      </Box>

      <Box px="2">
        <Grid templateColumns="repeat(2, 1fr)" gap="4">
          <Link as={NextLink} href="/">
            <>
              <Button>Cancel</Button>
            </>
          </Link>
          <Button
            onClick={presentVC}
            colorScheme="blue"
            disabled={vcRequest && presentationVCID.length < vcRequest.presentation_definition.input_descriptors.length}
          >
            Submit
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};
