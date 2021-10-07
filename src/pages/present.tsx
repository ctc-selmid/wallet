import axios from "axios";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";

import { PresentTemplate } from "../components/templates/Present";
import { COOKIE_VC_REQUEST_KEY } from "../configs/constants";
import { VCRequest } from "../lib/utils";
import { Manifest } from "../types";

interface PresentPageProps {
  manifest: Manifest;
  vcRequest: VCRequest;
}

const PresentPage: React.FC<PresentPageProps> = ({ manifest, vcRequest }) => {
  return <PresentTemplate manifest={manifest} vcRequest={vcRequest} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const vcRequestString = parseCookies(ctx)[COOKIE_VC_REQUEST_KEY];
  if (!vcRequestString) {
    return {
      redirect: {
        destination: "/scanner",
        permanent: false,
      },
    };
  }
  const vcRequest = JSON.parse(vcRequestString);
  const manifestUrl = vcRequest.presentation_definition.input_descriptors[0].issuance[0].manifest;

  const manifestResponse = await axios.get(manifestUrl);
  const { data: manifest } = manifestResponse;
  return {
    props: {
      manifest,
      vcRequest,
    },
  };
};

export default PresentPage;
