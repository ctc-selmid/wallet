import { LOCAL_STORAGE_VC } from "../configs/constants";

export const storeVC = (key: string, vc: string) => {
  localStorage.setItem(
    LOCAL_STORAGE_VC,
    JSON.stringify({
      ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_VC)),
      [key]: vc,
    })
  );
};

export const getVC = (key: string) => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_VC))[key];
};
