import jsonwebtoken from "jsonwebtoken";

import { QR_REQUEST_URI_KEY } from "../configs/constants";
import { VCRequest } from "../types";

export type VCRequestType = "issue" | "present";

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
