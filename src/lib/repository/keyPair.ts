import { LOCAL_STORAGE_KEY_PAIR } from "../../configs/constants";
import { KeyPair } from "../signer";

export const getKeyPair = (): KeyPair => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PAIR));
};

export const saveKeyPair = (keyPair: KeyPair): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_PAIR, JSON.stringify(keyPair));
};

export const deleteKeyPair = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY_PAIR);
};
