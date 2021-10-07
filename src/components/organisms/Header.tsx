import { Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
