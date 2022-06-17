import { Box, Button, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

import { initKeyPair } from "../../lib/repository/keyPair";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateKeyProps {}

export const CreateKey: React.FC<CreateKeyProps> = () => {
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [aPassword, setAPassword] = React.useState("");

  const showSecret = () => setShow(!show);
  const createKey = async () => {
    //TODO: 一致していなければエラーを出す
    if (password === aPassword) {
      await initKeyPair(password);
      router.push("/");
    }
  };
  return (
    <>
      <Text textAlign="center" fontSize="3xl" fontWeight="bold">
        Create Key
      </Text>
      <Box p={"5"}>
        <Text>Password</Text>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showSecret}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text>Again Password</Text>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setAPassword(e.target.value)}
            autoComplete="new-password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={showSecret}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Box paddingTop={"12"}>
          <Button width={"100%"} rounded={"2xl"} colorScheme="blue" onClick={createKey}>
            Create
          </Button>
        </Box>
      </Box>
    </>
  );
};
