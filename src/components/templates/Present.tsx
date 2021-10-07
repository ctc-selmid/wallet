import React from "react";

import { VCRequest } from "../../lib/utils";
import { Manifest } from "../../types";
import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Header } from "../organisms/Header";
import { Present } from "../organisms/Present";

export interface PresentTemplateProps {
  manifest: Manifest;
  vcRequest: VCRequest;
}

export const PresentTemplate: React.FC<PresentTemplateProps> = ({ manifest, vcRequest }) => {
  return (
    <Body>
      <Header />
      <Container>
        <Present manifest={manifest} vcRequest={vcRequest} />
      </Container>
    </Body>
  );
};
