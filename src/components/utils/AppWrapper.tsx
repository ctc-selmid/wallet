import React from "react";

import { ChakraProvider } from "@chakra-ui/react";

export interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};
