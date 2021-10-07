import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { LocalStoragePrivateKeyProvider } from "./LocalStoragePrivateKey/LocalStoragePrivateKeyProvider";

export interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <ChakraProvider>
      <LocalStoragePrivateKeyProvider>{children}</LocalStoragePrivateKeyProvider>
    </ChakraProvider>
  );
};
