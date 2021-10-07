import { createContext } from "react";

export const LocalStoragePrivateKeyContext = createContext<{ isReady: boolean; privateKey: string | undefined }>({
  isReady: false,
  privateKey: "",
});
