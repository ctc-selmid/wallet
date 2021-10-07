import crypto from "crypto";

import { LOCAL_STORAGE_PRIVATE_KEY } from "../configs/constants";

export const setPrivateKey = (privateKey: Buffer): void => {
  localStorage.setItem(LOCAL_STORAGE_PRIVATE_KEY, privateKey.toString("hex"));
};

export const getPrivateKey = (): void => {
  Buffer.from(localStorage.getItem(LOCAL_STORAGE_PRIVATE_KEY), "hex");
};

export const generatePrivateKey = (): Buffer => {
  return crypto.randomBytes(32);
};

export const getPublicKeyFromPrivateKey = (privateKey: Buffer) => {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.setPrivateKey(privateKey);
  const publicKey = ecdh.getPublicKey();
  return publicKey.slice(1);
};

export const privateKeyToPem = (privateKey: Buffer) => {
  const asn1 = `302e0201010420${privateKey.toString("hex")}a00706052b8104000a`;
  const asn1Base64 = Buffer.from(asn1, "hex").toString("base64");
  const pem = `-----BEGIN EC PRIVATE KEY-----\n${asn1Base64}$"\n-----END EC PRIVATE KEY-----"`;
  return pem;
};
