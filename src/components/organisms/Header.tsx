import React from "react";
import NextLink from "next/link";
import { Box, Link } from "@chakra-ui/react";

export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Box>
      <Link href="/scanner" as={NextLink}>
        Scan
      </Link>
    </Box>
  );
};
