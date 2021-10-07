import React from "react";
import dynamic from "next/dynamic";

import {
  getRequestFromVCRequest,
  getRequestUrlFromQRCodeMessage,
  proxyHttpRequest,
  validateVCRequest,
} from "../../lib/utils";

import { setCookie } from "nookies";

import { useRouter } from "next/router";
import { COOKIE_VC_REQUEST_KEY } from "../../configs/constants";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false }) as any;

export interface ScannerProps {}

export const Scanner: React.FC<ScannerProps> = () => {
  const router = useRouter();

  const handleQrReaderScanned = async (message) => {
    if (!message) {
      return;
    }
    const requestUrl = getRequestUrlFromQRCodeMessage(message);
    const vcRequestInJwt = await proxyHttpRequest<string>("get", requestUrl);
    validateVCRequest(vcRequestInJwt);
    const { vcRequestType, vcRequest } = await getRequestFromVCRequest(vcRequestInJwt);
    setCookie(null, COOKIE_VC_REQUEST_KEY, JSON.stringify(vcRequest));
    router.push(`/${vcRequestType}`);
  };

  const handleQrReaderError = (err) => {
    console.error(err);
  };

  return <QrReader onError={handleQrReaderError} onScan={handleQrReaderScanned} />;
};
