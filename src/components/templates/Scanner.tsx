import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Header } from "../organisms/Header";
import { Scanner } from "../organisms/Scanner";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScannerTemplateProps {}

export const ScannerTemplate: React.FC<ScannerTemplateProps> = () => {
  return (
    <Body>
      <Header />
      <Container py="8">
        <Scanner />
      </Container>
    </Body>
  );
};
