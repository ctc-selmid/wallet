import React from "react";
import { LocalStoragePrivateKeyContext } from "./LocalStoragePrivateKeyContext";

import { generatePrivateKey } from "../../../lib/crypto";
import { LOCAL_STORAGE_PRIVATE_KEY } from "../../../configs/constants";

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const LocalStoragePrivateKeyProvider: React.VFC<AuthProviderProps> = ({ children }) => {
  const [privateKey, setPrivateKey] = React.useState("");
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    let privateKey = localStorage.getItem(LOCAL_STORAGE_PRIVATE_KEY);
    if (!privateKey) {
      privateKey = generatePrivateKey();
      localStorage.setItem(LOCAL_STORAGE_PRIVATE_KEY, privateKey);
    }
    setPrivateKey(privateKey);
    setIsReady(true);
  }, []);

  return (
    <LocalStoragePrivateKeyContext.Provider value={{ isReady, privateKey }}>
      {children}
    </LocalStoragePrivateKeyContext.Provider>
  );
};
