import base64url from "base64url";

export const siop = () => {};

export const validateIssueRequest = () => {};

export const validatePresentRequest = () => {};

export const convertPublicKeyToJwk = (publicKey: Buffer) => {
  const publicJwk = {
    crv: "secp256k1",
    kty: "EC",
    x: base64url.encode(publicKey.slice(0, 32)),
    y: base64url.encode(publicKey.slice(32)),
  };
  return publicJwk;
};
