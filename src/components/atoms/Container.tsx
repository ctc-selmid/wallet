import { Box } from "@chakra-ui/react";
import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <Box py="8">{children}</Box>;
};
