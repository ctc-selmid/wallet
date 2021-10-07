import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { KeyPairProvider } from "./KeyPair/KeyPairProvider";

export interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <ChakraProvider>
      <KeyPairProvider>{children}</KeyPairProvider>
    </ChakraProvider>
  );
};
