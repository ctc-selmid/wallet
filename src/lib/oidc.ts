import base64url from "base64url";
import crypto from "crypto";
import { GetServerSidePropsContext } from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import { COOKIE_ID_CODE_VERIFIER, COOKIE_ID_TOKEN_KEY, COOKIE_ID_TOKEN_STATE } from "../configs/constants";

export interface RedirectConfig {
  key: string;
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
}

export interface AuthorizationContext {
  idTokenKey: string;
  idTokenState: string;
  codeVerifier: string;
}

// TODO:randomの値が使い回しがいいのかどうか後で考える
// https://github.com/panva/node-openid-client/blob/0d684f4d92ce57bc72d8e076c1d2d9e05ac613d7/lib/helpers/generators.js
// ここを参考にした。
export const authorize = (config: RedirectConfig): void => {
  const random = crypto.randomBytes(32);

  const state = base64url.encode(random);
  const nonce = base64url.encode(random);
  const codeVerifier = base64url.encode(random);

  setCookie(null, COOKIE_ID_TOKEN_KEY, config.key);
  setCookie(null, COOKIE_ID_TOKEN_STATE, state);
  setCookie(null, COOKIE_ID_CODE_VERIFIER, codeVerifier);

  const codeChallenge = base64url.encode(crypto.createHash("sha256").update(codeVerifier).digest());

  window.location.href = `${config.authorizationEndpoint}&client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=openid&state=${state}&nonce=${nonce}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
};

export const getAndRefreshAuthorizationContext = (ctx: GetServerSidePropsContext): AuthorizationContext => {
  const idTokenKey = parseCookies(ctx)[COOKIE_ID_TOKEN_KEY];
  const idTokenState = parseCookies(ctx)[COOKIE_ID_TOKEN_STATE];
  const codeVerifier = parseCookies(ctx)[COOKIE_ID_CODE_VERIFIER];
  // destroyCookie(ctx, COOKIE_ID_TOKEN_KEY);
  // destroyCookie(ctx, COOKIE_ID_TOKEN_STATE);
  return {
    idTokenKey,
    idTokenState,
    codeVerifier,
  };
};
