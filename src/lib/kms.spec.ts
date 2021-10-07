import { generatePrivateKey, getPublicKeyFromPrivateKey } from "./kms";

describe("test crypto", () => {
  it("generateKeyPair", async () => {
    const privateKey = generatePrivateKey();
    getPublicKeyFromPrivateKey(privateKey);
    // const { publicKey, privateKey } = generateKeyPair();
    // console.log(publicKey);
    // console.log(convertPublicKeyFromDerToJwk(publicKey));
    // console.log(publicKey.export({ format: "jwk" }));
    // publicKeyToJwk(publicKey)
    // console.log(await covertSpkiToJwk(publicKey));
  });
});
