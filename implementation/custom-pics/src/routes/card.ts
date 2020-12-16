import express from "express";

import {
  CryptoBuilder,
  ValidatorBuilder,
} from "verifiablecredentials-verification-sdk-typescript";

const router = express.Router();

router.post("/issue", async (req, res) => {
  const siopToken = req.body;

  let crypto = new CryptoBuilder().build();

  const trustedIssuer = [
    "https://verifiablecreds.b2clogin.com/verifiablecreds.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_sisu",
  ];

  const validator = new ValidatorBuilder(crypto)
    .useTrustedIssuerConfigurationsForIdTokens(trustedIssuer)
    .build();

  const validationResult = await validator.validate(siopToken);
  console.log(validationResult);
  res.send({ vc: "ok" });
});

export default router;