import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Scanner } from "../organisms/Scanner";
import { Header } from "../organisms/Header";

export interface ScannerTemplateProps {}

export const ScannerTemplate: React.FC<ScannerTemplateProps> = () => {
  return (
    <Body>
      <Container>
        <Header />
        <Scanner />
      </Container>
    </Body>
  );
};
