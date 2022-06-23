import ION from "@decentralized-identity/ion-tools";
import axios from "axios";
import jsonwebtoken from "jsonwebtoken";
import moment from "moment";
import qs from "querystring";

import { Manifest, VCRequest } from "../types";
import { getVC } from "./repository/vc";
import { Signer } from "./signer";

interface Descriptor {
  id?: string;
  path?: string;
  encoding?: string;
  format?: string;
}

export const present = async (
  presentationVCID: string[],
  signer: Signer,
  vcRequest: VCRequest,
  manifest: Manifest
): Promise<void> => {
  /** VCにexchangeServiceがある場合 VC exchangeをする */
  const vcs = [];
  let pairWiseDidSigner = undefined;
  const descriptor_map: [Descriptor?] = [];
  for (let i = 0; presentationVCID.length > i; i++) {
    // 選択したVCを抽出する
    const key = presentationVCID[i];
    const vc = getVC(key);
    const decoded = jsonwebtoken.decode(vc.vc) as any;

    // VCにexchangeServiceがある場合 VC exchangeをする
    if (decoded["vc"]["exchangeService"]["id"] !== undefined) {
      const exchangeService = decoded.vc.exchangeService.id;
      const pairWiseDidKeyPair = await ION.generateKeyPair();
      // pairWiseDidSignerを生成する
      pairWiseDidSigner = new Signer();
      await pairWiseDidSigner.init(pairWiseDidKeyPair);

      const exchangeRequestIdToken = await signer.siop({
        aud: exchangeService,
        contract: manifest?.display?.contract,
        recipient: pairWiseDidSigner.did,
        vc: vc.vc,
      });
      const exchangeResponse = await axios.post(exchangeService, exchangeRequestIdToken, {
        headers: { "Content-Type": "text/plain" },
      });
      const { vc: exchangedVC } = exchangeResponse.data as unknown as { vc: string };
      vc.vc = exchangedVC;
    }
    vcs.push(vc.vc);
    descriptor_map.push({
      path: `$.attestations.presentations.${vcRequest.presentation_definition.input_descriptors[0].id}`,
      id: `${vcRequest.presentation_definition.input_descriptors[i].id}`,
      encoding: "base64Url",
      format: vc.format === "jwt_vc" ? "JWT" : "JSON-LD",
    });
  }

  const vp = await pairWiseDidSigner.createVP(vcs, vcRequest.iss);

  // TODO: 動的に変更する
  const attestations = {
    presentations: { [vcRequest.presentation_definition.input_descriptors[0].id]: vp },
  };

  const verifyRequestIdToken = pairWiseDidSigner
    ? await pairWiseDidSigner.siop({
        aud: vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
        nonce: vcRequest.nonce,
        state: vcRequest.state,
        attestations,
        presentation_submission: {
          descriptor_map,
        },
        nbf: moment().unix(),
      })
    : await signer.siop({
        aud: vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
        nonce: vcRequest.nonce,
        state: vcRequest.state,
        attestations,
        presentation_submission: {
          descriptor_map,
        },
        nbf: moment().unix(),
      });
  await axios.post(
    vcRequest.redirect_uri ? vcRequest.redirect_uri : vcRequest.client_id,
    qs.stringify({
      id_token: verifyRequestIdToken,
      state: vcRequest.state,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
};
