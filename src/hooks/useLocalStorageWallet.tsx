import React from "react";

import { LocalStoragePrivateKeyContext } from "../components/utils/LocalStoragePrivateKey/LocalStoragePrivateKeyContext";

export const useLocalStoragePrivateKey = (): { isReady: boolean; privateKey?: string } => {
  return React.useContext(LocalStoragePrivateKeyContext);
};
