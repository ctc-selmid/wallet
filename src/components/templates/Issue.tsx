import React from "react";

import { AcquiredAttestation, Manifest, VCRequest } from "../../types";
import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Header } from "../organisms/Header";
import { Issue } from "../organisms/Issue";

export interface IssueTemplateProps {
  vcRequest: VCRequest;
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

export const IssueTemplate: React.FC<IssueTemplateProps> = ({ vcRequest, manifest, acquiredAttestation }) => {
  return (
    <Body>
      <Header />
      <Container>
        <Issue vcRequest={vcRequest} manifest={manifest} acquiredAttestation={acquiredAttestation} />
      </Container>
    </Body>
  );
};
