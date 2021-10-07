import React from "react";
import Web3 from "web3";
import { Box } from "@chakra-ui/react";

import ION from "@decentralized-identity/ion-tools";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const getVC = async () => {
    console.log("get vc");
    let did = new ION.KeyPair({
      content: {
        publicKeys: [
          {
            id: "key-1",
            type: "EcdsaSecp256k1VerificationKey2019",
            publicKeyJwk: authnKeys.publicJwk,
            purposes: ["authentication"],
          },
        ],
        services: [
          {
            id: "domain-1",
            type: "LinkedDomains",
            serviceEndpoint: "https://foo.example.com",
          },
        ],
      },
    });
  };

  return <Box>Home</Box>;
};
