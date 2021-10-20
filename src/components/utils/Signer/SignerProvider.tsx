import ION from "@decentralized-identity/ion-tools";
import React from "react";

import { getKeyPair, saveKeyPair } from "../../../lib/repository/keyPair";
import { Signer } from "../../../lib/signer";
import { SignerContext } from "./SignerContext";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const SignerProvider: React.VFC<AuthProviderProps> = ({ children }) => {
  const [signer, setSigner] = React.useState<Signer>();
  const [isReady, setIsReady] = React.useState(false);

  const initialize = async (keyPair) => {
    const signer = new Signer();
    await signer.init(keyPair);
    setSigner(signer);
    setIsReady(true);
  };

  React.useEffect(() => {
    const keyPair = getKeyPair();
    if (!keyPair) {
      ION.generateKeyPair().then((keyPair) => {
        saveKeyPair(keyPair);
        initialize(keyPair);
      });
    } else {
      initialize(keyPair);
    }
  }, []);

  return <SignerContext.Provider value={{ isReady, signer }}>{children}</SignerContext.Provider>;
};
