import { keccak256 } from "./hash";

export const computeEthereumAddress = (publicKey: Buffer) => {
  return keccak256("keccak256").update(publicKey).digest().slice(12, 32);
};
