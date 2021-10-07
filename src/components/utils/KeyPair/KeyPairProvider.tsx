import React from "react";
import { KeyPairContext } from "./KeyPairContext";

import ION from "@decentralized-identity/ion-tools";
import { saveKeyPair, getKeyPair } from "../../../lib/repository/keyPair";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const KeyPairProvider: React.VFC<AuthProviderProps> = ({ children }) => {
  const [keyPair, setKeyPair] = React.useState("");
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let keyPair = getKeyPair();
    if (!keyPair) {
      ION.generateKeyPair().then((keyPair) => {
        keyPair = keyPair;
        saveKeyPair(keyPair);
        setKeyPair(keyPair);
        setIsReady(true);
      });
    } else {
      setKeyPair(keyPair);
      setIsReady(true);
    }
  }, []);

  return <KeyPairContext.Provider value={{ isReady, keyPair }}>{children}</KeyPairContext.Provider>;
};
