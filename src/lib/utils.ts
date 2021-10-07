import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import base64url from "base64url";
import crypto from "crypto";
import { calculateThumbprint } from "jose/jwk/thumbprint";
import { QR_REQUEST_URI_KEY, DID_ION_KEY_ID } from "../configs/constants";

import { VCRequest } from "../types";
export type VCRequestType = "issue" | "present";
export type HttpRequestMethod = "get" | "post";

import { sha256 } from "./hash";

export const getRequestUrlFromQRCodeMessage = (message: string): string => {
  const urlSearchParams = new URLSearchParams(message);
  const requestUrl = urlSearchParams.get(QR_REQUEST_URI_KEY);
  if (!requestUrl) {
    throw new Error("QR code is invalid");
  }
  return requestUrl;
};

export const validateVCRequest = async (jwt: string) => {};

export const getRequestFromVCRequest = (jwt: string) => {
  const decodedRequestData = <VCRequest>jsonwebtoken.decode(jwt);
  return {
    vcRequestType: decodedRequestData.prompt === "create" ? "issue" : "present",
    vcRequest: decodedRequestData,
  };
};

export const getManifestFromVCRequest = (jwt: string) => {
  const decodedRequestData = <JwtPayload>jsonwebtoken.decode(jwt);
  return decodedRequestData.presentation_definition.input_descriptors[0].issuance[0].manifest;
};

export const getCreateDidParam = (publicJwk) => {
  return {
    content: {
      publicKeys: [
        {
          id: DID_ION_KEY_ID,
          type: "EcdsaSecp256k1VerificationKey2019",
          publicKeyJwk: publicJwk,
          purposes: ["authentication"],
        },
      ],
    },
  };
};

export const generateJti = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const generateSiopHeader = (longFormDid: string) => {
  return {
    typ: "JWT",
    alg: "ES256K",
    kid: `${longFormDid}#${DID_ION_KEY_ID}`,
  };
};

export const generateSiopPayload = async ({ payload, publicJwk, longFormDid }) => {
  return {
    iat: +new Date(),
    exp: +new Date() + 60 * 30,
    did: longFormDid,
    jti: generateJti(),
    sub: await calculateThumbprint(publicJwk),
    sub_jwk: publicJwk,
    iss: "https://self-issued.me",
    ...payload,
  };
};
