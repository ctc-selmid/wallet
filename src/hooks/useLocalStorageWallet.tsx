import React from "react";

import { KeyPairContext, KeyPairContextProps } from "../components/utils/KeyPair/KeyPairContext";

export const useKeyPair = (): KeyPairContextProps => {
  return React.useContext(KeyPairContext);
};
