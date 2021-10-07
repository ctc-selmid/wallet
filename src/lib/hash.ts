import crypto from "crypto";
import createKeccakHash from "keccak";

export const sha256 = (data: Buffer | string): Buffer => {
  return crypto.createHash("sha256").update(data).digest();
};

export const keccak256 = (data: Buffer | string): Buffer => {
  return createKeccakHash("keccak256").update(data).digest();
};
