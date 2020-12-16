import { createSign, createHash } from "crypto-browserify";
import { getRandomBytes } from "expo-random";
import { ec as EC } from "elliptic";
const ec = new EC("secp256k1");

class ECDH {
  ec;
  setPrivateKey = (privateKey) => {
    this.ec = ec.keyFromPrivate(privateKey);
  };
  getPublicKey = () => {
    return this.ec.getPublic(false, true);
  };
}

const createECDH = () => {
  return new ECDH();
};

const randomBytes = (length) => {
  return Buffer.from(getRandomBytes(length));
};

const crypto = {
  createECDH,
  createHash,
  createSign,
  randomBytes,
};

export default crypto;
