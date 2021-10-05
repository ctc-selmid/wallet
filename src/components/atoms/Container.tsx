import React from "react";
import { Box } from "@chakra-ui/react";

export interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
