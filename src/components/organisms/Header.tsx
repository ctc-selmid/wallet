import { Flex, Link } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { HomeIcon, QrcodeIcon } from "@heroicons/react/outline";
import NextLink from "next/link";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Flex bg="blue.400" h={12} p={4} justifyContent="space-between" alignItems="center">
      <Link as={NextLink} href="/">
        <>
          <Icon color="white" w={6} h={6} as={HomeIcon} />
        </>
      </Link>
      <Link as={NextLink} href="/scanner">
        <>
          <Icon color="white" w={6} h={6} as={QrcodeIcon} />
        </>
      </Link>
    </Flex>
  );
};
