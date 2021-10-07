import { Box, Text } from "@chakra-ui/react";
import React from "react";

import { Card } from "../../types";

export interface CredentialProps {
  card: Card;
}

export const Credential: React.FC<CredentialProps> = ({ card }) => {
  return (
    <Box>
      <Text>issuedBy: {card.issuedBy}</Text>
      <Text>title: {card.title}</Text>
      <Text>description: {card.description}</Text>
    </Box>
  );
};
