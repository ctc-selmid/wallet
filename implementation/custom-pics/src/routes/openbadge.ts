import express from "express";
const router = express.Router();

import jws from "jws";
import fs from "fs";

const pngitxt = require("png-itxt");

router.get("/issue", (req, res) => {
  const { id } = req.query;

  const assertion = {
    type: "Assertion",
    id: `https://raw.githubusercontent.com/taijusanagi/public-json-server/master/openbadge-assertion-hosted-${id}.json`,
    "@context": "https://w3id.org/openbadges/v2",
    recipient: {
      type: "email",
      salt: "cb8e90ef60924b94b824c41da862c5b0",
      hashed: true,
      identity:
        "sha256$98f7af5ff502beb16afe038308098960913487958b88007762f6d1d8987bcf92",
    },
    badge:
      "https://raw.githubusercontent.com/taijusanagi/public-json-server/master/openbadge-class.json",
    issuedOn: "2020-10-14T15:00:00Z",
    image: {
      id: `https://raw.githubusercontent.com/taijusanagi/public-json-server/master/openbadge-assertion-hosted-${id}.png`,
    },
    verification: {
      type: "HostedBadge",
    },
  };

  fs.createReadStream("image-template.png")
    .pipe(
      pngitxt.set({
        type: "iTXt",
        keyword: "openbadges",
        compressed: false,
        compression_type: 0,
        language: "",
        translated: "",
        value: JSON.stringify(assertion),
      })
    )
    .pipe(fs.createWriteStream(`openbadge-assertion-hosted-${id}.png`));

  //   fs.createReadStream(`openbadge-assertion-hosted-${id}.png`).pipe(
  //     pngitxt.get("openbadges", function (err, data) {
  //       console.log(err, data);
  //       if (!err && data) {
  //         console.log(data);
  //       }
  //     })
  //   );
  res.sendStatus(200);
});

export default router;
