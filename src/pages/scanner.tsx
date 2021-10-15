import React from "react";

import { ScannerTemplate } from "../components/templates/Scanner";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ScannerPageProps {}

const ScannerPage: React.FC<ScannerPageProps> = () => {
  return <ScannerTemplate />;
};

export default ScannerPage;
