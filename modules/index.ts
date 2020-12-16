import crypto from "crypto";

export const constants = {
  did: {
    methodName: "ion",
    publicKeyType: "EcdsaSecp256k1VerificationKey2019",
    keyId: "signingKey",
  },
  jwt: {
    header: {
      alg: "ES256K",
    },
    payload: {
      iss: "https://self-issued.me",
      iat: 0,
      exp: 9999999999,
    },
  },
  jwk: {
    kty: "EC",
    crv: "P-256K",
  },
  ecdh: {
    crv: "secp256k1",
  },
  hash: {
    type: "sha256",
    fc: 0x12,
  },
  pem: {
    pre: "-----BEGIN EC PRIVATE KEY-----\n",
    post: "\n-----END EC PRIVATE KEY-----",
  },
  asn1: {
    pre: "302e0201010420",
    post: "a00706052b8104000a",
  },
};

export const base64url = {
  encode: (unencoded) => {
    return Buffer.from(unencoded)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
  decode: (encoded) => {
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) {
      encoded += "=";
    }
    return Buffer.from(encoded, "base64").toString("utf8");
  },
};

export const jwt = {
  decode: (jwt) => {
    const payload = JSON.parse(base64url.decode(jwt.split(".")[1]));
    return payload;
  },
};

export const multihash = (data) => {
  const digest = crypto.createHash(constants.hash.type).update(data).digest();
  const prefix = Buffer.from([constants.hash.fc, digest.length]);
  return Buffer.concat([prefix, digest]);
};

export const generateJti = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const generatePrivateKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const privateKeyToPem = (privateKey) => {
  const asn1 = `${constants.asn1.pre}${privateKey}${constants.asn1.post}`;
  const asn1Base64 = Buffer.from(asn1, "hex").toString("base64");
  const pem = `${constants.pem.pre}${asn1Base64}${constants.pem.post}`;
  return pem;
};

export const privateKeyToJwk = (privateKey) => {
  const privateKeyBuffer = Buffer.from(privateKey, "hex");
  const ecdh = crypto.createECDH(constants.ecdh.crv);
  ecdh.setPrivateKey(privateKeyBuffer);
  const pub = ecdh.getPublicKey();
  const publicKeyJwk = {
    kty: constants.jwk.kty,
    crv: constants.jwk.crv,
    x: base64url.encode(pub.slice(1, 32 + 1)),
    y: base64url.encode(pub.slice(32 + 1)),
  };
  const privateKeyJwk = {
    d: base64url.encode(privateKeyBuffer),
    ...publicKeyJwk,
  };
  return { publicKeyJwk, privateKeyJwk };
};

export const publicKeyJwkToIonDid = (publicKeyJwk) => {
  const id = constants.did.keyId;
  const canonical_jwk = JSON.stringify(publicKeyJwk);
  const commitment_hash = base64url.encode(multihash(canonical_jwk));
  const patches = [
    {
      action: "replace",
      document: {
        public_keys: [
          {
            id,
            type: constants.did.publicKeyType,
            jwk: publicKeyJwk,
            purpose: ["auth", "general"],
          },
        ],
      },
    },
  ];
  const canonical_delta = JSON.stringify({
    update_commitment: commitment_hash,
    patches,
  });
  const delta = base64url.encode(canonical_delta);
  const delta_hash = base64url.encode(multihash(canonical_delta));
  const canonical_suffix_data = JSON.stringify({
    delta_hash,
    recovery_commitment: commitment_hash,
  });
  const didUniqueSuffix = base64url.encode(multihash(canonical_suffix_data));
  const suffix_data = base64url.encode(canonical_suffix_data);
  const shortFormDid = `did:${constants.did.methodName}:${didUniqueSuffix}`;
  const longFormDid = `${shortFormDid}?-${constants.did.methodName}-initial-state=${suffix_data}.${delta}`;
  return longFormDid;
};

export class Wallet {
  privateKey;
  publicKeyJwk;
  privateKeyJwk;
  did;
  constructor(privateKey?) {
    this.privateKey = privateKey ? privateKey : generatePrivateKey();
    const { publicKeyJwk, privateKeyJwk } = privateKeyToJwk(this.privateKey);
    this.publicKeyJwk = publicKeyJwk;
    this.privateKeyJwk = privateKeyJwk;
    this.did = publicKeyJwkToIonDid(publicKeyJwk);
  }

  siop = (options?) => {
    const jti = generateJti();
    const header = {
      alg: constants.jwt.header.alg,
      kid: `${this.did}#${constants.did.keyId}`,
    };
    const payload = {
      iss: constants.jwt.payload.iss,
      iat: constants.jwt.payload.iat,
      exp: constants.jwt.payload.exp,
      did: this.did,
      jti,
      sub_jwk:this.publicKeyJwk,
      ...options,
    };
    return this.sign(header, payload);
  };

  sign = (header, payload) => {
    const pem = privateKeyToPem(this.privateKey);
    const encodedHeader = base64url.encode(JSON.stringify(header));
    const encodedPayload = base64url.encode(JSON.stringify(payload));
    const message = `${encodedHeader}.${encodedPayload}`;
    const signature = base64url.encode(
      crypto.createSign(constants.hash.type).update(message).sign(pem)
    );
    const result = `${encodedHeader}.${encodedPayload}.${signature}`;
    return result;
  };
}