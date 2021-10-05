import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Issue } from "../organisms/Issue";
import { Header } from "../organisms/Header";

import { AcquiredAttestation, Manifest } from "../../lib/types";

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
