import base64url from "base64url";
import crypto from "crypto";
import { GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { COOKIE_ID_TOKEN_KEY, COOKIE_ID_TOKEN_STATE } from "../configs/constants";

export interface RedirectConfig {
  key: string;
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
}

export interface AuthorizationContext {
  idTokenKey: string;
  idTokenState: string;
}

export const authorize = (config: RedirectConfig): void => {
  const state = base64url(crypto.randomBytes(4));
  setCookie(null, COOKIE_ID_TOKEN_KEY, config.key);
  setCookie(null, COOKIE_ID_TOKEN_STATE, state);
  window.location.href = `${config.authorizationEndpoint}?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=openid&state=${state}`;
};

export const getAndRefreshAuthorizationContext = (ctx: GetServerSidePropsContext): AuthorizationContext => {
  const idTokenKey = parseCookies(ctx)[COOKIE_ID_TOKEN_KEY];
  const idTokenState = parseCookies(ctx)[COOKIE_ID_TOKEN_STATE];
  destroyCookie(ctx, COOKIE_ID_TOKEN_KEY);
  destroyCookie(ctx, COOKIE_ID_TOKEN_STATE);
  return {
    idTokenKey,
    idTokenState,
  };
};
