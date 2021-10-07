import React from "react";

import { Body } from "../atoms/Body";
import { Container } from "../atoms/Container";
import { Header } from "../organisms/Header";
import { Home } from "../organisms/Home";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeTemplateProps {}

export const HomeTemplate: React.FC<HomeTemplateProps> = () => {
  return (
    <Body>
      <Header />
      <Container>
        <Home />
      </Container>
    </Body>
  );
};
