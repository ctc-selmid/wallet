import crypto from "crypto";

export const generateOpenIdConnectState = () => {
  return crypto.randomBytes(4).toString("hex");
};

export const generateCodeVerifier = () => {
  return crypto.randomBytes(44).toString("hex");
};
