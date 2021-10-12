import React from "react";

import { HomeTemplate } from "../components/templates/Home";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IndexPageProps {}

const IndexPage: React.FC<IndexPageProps> = () => {
  return <HomeTemplate cards={[]} />;
};

export default IndexPage;
