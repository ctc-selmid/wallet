import React from "react";
import { Box } from "@chakra-ui/react";

export interface BodyProps {
  children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
