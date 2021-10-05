import React from "react";
import Web3 from "web3";
import { Box } from "@chakra-ui/react";

export interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const click = async () => {
    const a = window as any;
    await a.ethereum.enable();
    const web3 = new Web3(a.ethereum);
    const [account] = await web3.eth.getAccounts();
    await web3.eth.sign("ok", account);
    console.log(await web3.eth.getAccounts());
    console.log("click");
  };

  return <Box onClick={click}>Home</Box>;
};
