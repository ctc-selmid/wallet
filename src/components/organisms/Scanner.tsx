import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import React from "react";

import { COOKIE_VC_REQUEST_KEY } from "../../configs/constants";
import { proxyHttpRequest } from "../../lib/http";
import { getRequestFromVCRequest, getRequestUrlFromQRCodeMessage } from "../../lib/utils";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false }) as any;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScannerProps {}

export const Scanner: React.FC<ScannerProps> = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const router = useRouter();

  const handleQrReaderScanned = async (message) => {
    if (!message || isProcessing) {
      return;
    }
    setIsProcessing(true);
    const requestUrl = getRequestUrlFromQRCodeMessage(message);
    const vcRequestInJwt = await proxyHttpRequest<string>("get", requestUrl);

    const { vcRequestType, vcRequest } = await getRequestFromVCRequest(vcRequestInJwt);
    setCookie(null, COOKIE_VC_REQUEST_KEY, JSON.stringify(vcRequest));

    router.push(`/${vcRequestType}`);
  };

  const handleQrReaderError = (err) => {
    console.error(err);
  };

  return <QrReader onError={handleQrReaderError} onScan={handleQrReaderScanned} />;
};
