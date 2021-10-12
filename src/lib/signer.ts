import ION from "@decentralized-identity/ion-tools";
import { calculateThumbprint, JWK } from "jose/jwk/thumbprint";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { DID_ION_KEY_ID, SIOP_VALIDITY_IN_MINUTES } from "../configs/constants";

export interface KeyPair {
  publicJwk: JWK;
  privateJwk: JWK;
}

export interface SiopOptions {
  aud: string;
  contract?: string;
  attestations?: any;
  recipient?: string;
  vc?: string;
  nonce?: string;
  state?: string;
}

export class Signer {
  did: string;
  keyPair: KeyPair;

  init = async (keyPair: KeyPair): Promise<void> => {
    this.keyPair = keyPair;
    const did = new ION.DID({
      content: {
        publicKeys: [
          {
            id: DID_ION_KEY_ID,
            type: "EcdsaSecp256k1VerificationKey2019",
            publicKeyJwk: keyPair.publicJwk,
            purposes: ["authentication"],
          },
        ],
      },
    });
    this.did = await did.getURI();
  };

  siop = async (options: SiopOptions): Promise<string> => {
    return await ION.signJws({
      header: {
        typ: "JWT",
        alg: "ES256K",
        kid: `${this.did}#${DID_ION_KEY_ID}`,
      },
      payload: {
        iat: moment().unix(),
        exp: moment().add(SIOP_VALIDITY_IN_MINUTES, "minutes").unix(),
        did: this.did,
        jti: uuidv4().toUpperCase(),
        sub: await calculateThumbprint(this.keyPair.publicJwk),
        sub_jwk: this.keyPair.publicJwk,
        iss: "https://self-issued.me",
        ...options,
      },
      privateJwk: this.keyPair.privateJwk,
    });
  };
}
