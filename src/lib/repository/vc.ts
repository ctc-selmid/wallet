import { LOCAL_STORAGE_VC } from "../../configs/constants";
import { Manifest } from "../../types";

export interface VC {
  jwt: string;
  manifest: Manifest;
}

export const getVCs = (): VC => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_VC));
};

export const getVC = (key: string): VC => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_VC))[key];
};

export const saveVC = (key: string, vc: VC): void => {
  localStorage.setItem(
    LOCAL_STORAGE_VC,
    JSON.stringify({
      ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_VC)),
      [key]: vc,
    })
  );
};

export const deleteVC = (key: string): void => {
  const vc = localStorage.getItem(LOCAL_STORAGE_VC);
  delete vc[key];
  localStorage.setItem(LOCAL_STORAGE_VC, JSON.stringify(vc));
};
