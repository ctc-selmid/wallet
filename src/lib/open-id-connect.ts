import crypto from "crypto";

export const generateState = () => {
  return crypto.randomBytes(4).toString("hex");
};

export const generateCodeVerifier = () => {
  return crypto.randomBytes(44).toString("hex");
};

export const generateJti = () => {
  return crypto.randomBytes(16).toString("hex");
};
