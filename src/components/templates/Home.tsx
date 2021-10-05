import * as React from "react";

import { Home } from "../organisms/Home";

export interface HomeTemplateProps {}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({ projects }) => {
  return <Home />;
};
