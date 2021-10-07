import { createContext } from "react";

export interface KeyPairContextProps {
  isReady: boolean;
  keyPair: any | undefined;
}

export const KeyPairContext = createContext<KeyPairContextProps>({
  isReady: false,
  keyPair: undefined,
});
