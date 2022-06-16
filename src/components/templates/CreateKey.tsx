import { Box, Text } from "@chakra-ui/react";
import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { CreateKey } from "../organisms/CreateKey";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateKeyTemplateProps {}

export const CreateKeyTemplate: React.FC<CreateKeyTemplateProps> = () => {
  return (
    <Body>
      <Box bg="blue.400" h={12} p={4} alignItems="center"></Box>
      <Container py="0">
        <CreateKey />
      </Container>
    </Body>
  );
};
