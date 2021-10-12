import { Box, Button, Grid, Link, Text } from "@chakra-ui/react";
import ION from "@decentralized-identity/ion-tools";
import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import NextLink from "next/link";
import qs from "querystring";
import React from "react";

import { useSigner } from "../../hooks/useSigner";
import { getVC } from "../../lib/repository/vc";
import { Signer } from "../../lib/signer";
import { Manifest, VCRequest } from "../../types";
import { CredentialCard } from "../molecules/CredentialCard";

export interface PresentProps {
  vcRequest: VCRequest;
  manifest: Manifest;
}

export const Present: React.FC<PresentProps> = ({ manifest, vcRequest }) => {
  const { signer } = useSigner();

  const presentVC = async () => {
    const vc = getVC(manifest.display.contract);

    const decoded = jsonwebtoken.decode(vc) as any;

    const exchangeService = decoded.vc.exchangeService.id;
    const pairWiseDidKeyPair = await ION.generateKeyPair();
    const pairWiseDidSigner = new Signer();
    await pairWiseDidSigner.init(pairWiseDidKeyPair);

    const exchangeRequestIdToken = await signer.siop({
      aud: exchangeService,
      contract: manifest.display.contract,
      recipient: pairWiseDidSigner.did,
      vc: vc,
    });
    const exchangeResponse = await axios.post(exchangeService, exchangeRequestIdToken, {
      headers: { "Content-Type": "text/plain" },
    });
    const { vc: exchangedVC } = exchangeResponse.data as unknown as { vc: string };

    const attestations = {
      presentations: {
        [vcRequest.presentation_definition.input_descriptors[0].issuance[0].manifest]: exchangedVC,
      },
    };

    const verifyRequestIdToken = await pairWiseDidSigner.siop({
      aud: vcRequest.redirect_uri,
      nonce: vcRequest.nonce,
      state: vcRequest.state,
      attestations,
    });

    await axios.post(
      vcRequest.redirect_uri,
      qs.stringify({
        id_token: verifyRequestIdToken,
        state: vcRequest.state,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  };

  return (
    <Box>
      <Box mb="8">
        <Text textAlign="center" fontSize="3xl" fontWeight="bold">
          New Permission Request
        </Text>
      </Box>
      <Box px="2" mb="8">
        <CredentialCard card={manifest.display.card} />
      </Box>

      <Box px="2">
        <Grid templateColumns="repeat(2, 1fr)" gap="4">
          <Link as={NextLink} href="/">
            <>
              <Button>Cancel</Button>
            </>
          </Link>
          <Button onClick={presentVC} colorScheme="blue">
            Submit
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};
