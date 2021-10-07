import jsonwebtoken from "jsonwebtoken";

import { QR_REQUEST_URI_KEY } from "../configs/constants";

export type VCRequestType = "issue" | "present";

export interface PresentationDefinition {
  input_descriptors: {
    issuance: {
      manifest: string;
    }[];
  }[];
}

export interface VCRequest {
  prompt?: string;
  redirect_uri?: string;
  presentation_definition: PresentationDefinition;
  nonce?: string;
  state?: string;
}

export const getRequestUrlFromQRCodeMessage = (message: string): string => {
  const urlSearchParams = new URLSearchParams(message);
  const requestUrl = urlSearchParams.get(QR_REQUEST_URI_KEY);
  if (!requestUrl) {
    throw new Error("QR code does not contains request url");
  }
  return requestUrl;
};

export const getRequestFromVCRequest = (
  jwt: string
): {
  vcRequestType: VCRequestType;
  vcRequest: VCRequest;
} => {
  const decodedRequestData = <VCRequest>jsonwebtoken.decode(jwt);
  return {
    vcRequestType: decodedRequestData.prompt === "create" ? "issue" : "present",
    vcRequest: decodedRequestData,
  };
};
