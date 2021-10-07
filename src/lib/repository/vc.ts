import { LOCAL_STORAGE_VC } from "../../configs/constants";

export const getVC = (key: string): string => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_VC))[key];
};

export const saveVC = (key: string, vc: string): void => {
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
