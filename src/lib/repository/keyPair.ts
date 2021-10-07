import { LOCAL_STORAGE_KEY_PAIR } from "../../configs/constants";

export const getKeyPair = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_PAIR));
};

export const saveKeyPair = (privateJwk: any) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_PAIR, JSON.stringify(privateJwk));
};

export const deleteKeyPair = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY_PAIR);
};
