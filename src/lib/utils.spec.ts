import { getRequestUrlFromQRCodeMessage, getRequestFromVCRequest } from "./utils";
import { QR_REQUEST_URI_KEY } from "../configs/constants";

describe("test utils", () => {
  it("getRequestUrlFromQRCode", async () => {
    const expectedRequestUrl =
      "https%3A%2F%2F5a8b-39-110-214-139.ngrok.io%2Fissue-request.jwt%3Fid%3DVhGPvOWWiFmGRrMfAnLMsqvSPKImqpe9";
    const qrcodeMessage = `${QR_REQUEST_URI_KEY}=${expectedRequestUrl}`;
    const requestUrl = getRequestUrlFromQRCodeMessage(qrcodeMessage);
    expect(encodeURIComponent(requestUrl)).toBe(expectedRequestUrl);
  });
});
