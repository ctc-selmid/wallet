import React from "react";

import { AcquiredAttestation, Manifest } from "../../types";
import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Header } from "../organisms/Header";
import { Issue } from "../organisms/Issue";

export interface IssueTemplateProps {
  manifest: Manifest;
  acquiredAttestation: AcquiredAttestation;
}

export const IssueTemplate: React.FC<IssueTemplateProps> = ({ manifest, acquiredAttestation }) => {
  return (
    <Body>
      <Header />
      <Container>
        <Issue manifest={manifest} acquiredAttestation={acquiredAttestation} />
      </Container>
    </Body>
  );
};
