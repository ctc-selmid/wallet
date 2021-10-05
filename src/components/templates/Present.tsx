import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Present } from "../organisms/Present";
import { Header } from "../organisms/Header";

export interface PresentTemplateProps {}

export const PresentTemplate: React.FC<PresentTemplateProps> = () => {
  return (
    <Body>
      <Header />
      <Container>
        <Present />
      </Container>
    </Body>
  );
};
