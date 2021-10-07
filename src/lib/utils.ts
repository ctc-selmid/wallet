import axios from "axios";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

import { QR_REQUEST_URI_KEY } from "../configs/constants";
import { PROXY_API, PROXY_TARGET_KEY } from "../configs/constants";
import { VCRequest } from "../types";
export type VCRequestType = "issue" | "present";
export type HttpRequestMethod = "get" | "post";

export const proxyHttpRequest = async <T>(method: HttpRequestMethod, url: string, param?: any): Promise<T> => {
  let response;
  const configs = {
    headers: {
      [PROXY_TARGET_KEY]: url,
    },
  };
  if (method === "get") {
    response = await axios.get(PROXY_API, configs);
  } else if (method === "post") {
    response = await axios.post(PROXY_API, param, configs);
  } else {
    throw new Error("method is invalid");
  }
  const { data } = response;
  return data;
};

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
