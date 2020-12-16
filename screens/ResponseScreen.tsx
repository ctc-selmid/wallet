import * as Linking from "expo-linking";
import * as React from "react";
import { Card, Divider, Button, Header } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";
import { Platform } from "react-native";

import axios from "axios";
import tailwind from "tailwind-rn";

import Container from "../components/atoms/Container";
import Layout from "../components/atoms/Layout";
import Section from "../components/atoms/Section";
import Credential from "../components/molecules/Credential";
import { WalletContext } from "../contexts";
import { initializeResponse, appendCorsAnywhere } from "../hooks";
import { Wallet } from "../modules";
const qs = require("querystring");

export default ({ navigation }) => {
  const wallet = React.useContext(WalletContext) as Wallet;
  const {
    manifestState,
    requestState,
    modeState,
    vcState,
    presentaionManifestState,
    idTokenState,
  } = initializeResponse();

  const isLoadingComplete = manifestState && requestState && modeState;

  const submit = async () => {
    let attestations;

    if (
      manifestState.input.attestations.idTokens &&
      manifestState.input.attestations.presentations
    ) {
      attestations = {
        idTokens: {
          [manifestState.input.attestations.idTokens[0]
            .configuration]: idTokenState,
        },
        presentations: {
          [manifestState.input.attestations.presentations[0].credentialType]:
            vcState.vc,
        },
      };
    } else if (
      manifestState.input.attestations.idTokens &&
      !manifestState.input.attestations.presentations
    ) {
      attestations = {
        idTokens: {
          [manifestState.input.attestations.idTokens[0]
            .configuration]: idTokenState,
        },
      };
    } else if (
      !manifestState.input.attestations.idTokens &&
      manifestState.input.attestations.presentations
    ) {
      attestations = {
        presentations: {
          [manifestState.input.attestations.presentations[0].credentialType]:
            vcState.vc,
        },
      };
    }    

    if(modeState === "receive"){
      const payload = {
        aud: manifestState.input.credentialIssuer,
        contract:
          requestState.presentation_definition.input_descriptors[0].issuance[0]
            .manifest,
        attestations,
      };
      const selfIssuedIdToken = wallet.siop(payload);
      const vcResponse = await axios.post(
        manifestState.input.credentialIssuer,
        selfIssuedIdToken,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      const original = await AsyncStorage.getItem("@vc");
      let parsed;
      if (original) {
        parsed = JSON.parse(original);
      }
      const vc = {
        ...parsed,
        [requestState.presentation_definition.input_descriptors[0].schema.uri[0]]: {
          vc: vcResponse.data.vc,
          card: manifestState.display.card,
        },
      };
      await AsyncStorage.setItem("@vc", JSON.stringify(vc));
    } else if (modeState === "present") {
      const attestations = {
        presentations: {
          [requestState.presentation_definition.input_descriptors[0].schema.uri[0]]:
            vcState.vc,
        },
      };
      const payload = {
        aud: requestState.redirect_uri,
        nonce: requestState.nonce,
        state: requestState.state,
        attestations,
      };
      const selfIssuedIdToken = wallet.siop(payload);
      await axios.post(
        appendCorsAnywhere(Platform.OS,requestState.redirect_uri),
        qs.stringify({id_token: selfIssuedIdToken, state: requestState.state}),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
    }
    window.location.href = window.location.href.split(/[?#]/)[0];
    navigation.navigate("Home");
  };

  const authenticate = async (openIdConfigurationUri, client_id) => {
    const openIdConfigurationResponse = await axios.get(openIdConfigurationUri);
    const openIdConfiguration = openIdConfigurationResponse.data;
    const redirect_uri = "https://browser-wallet.azurewebsites.net/";
    const authorizationUri = `${openIdConfiguration.authorization_endpoint}&redirect_uri=${redirect_uri}&client_id=${client_id}&response_type=code&scope=openid`;
    Linking.openURL(authorizationUri);
  };

  const CredentialsToBeIssued = () => {
    return (
      <Section>
        <Credential
          title={manifestState.display.card.title}
          icon={manifestState.display.card.logo.uri}
          issuedBy={manifestState.display.card.issuedBy}
          textColor={manifestState.display.card.textColor}
          backgroundColor={manifestState.display.card.backgroundColor}
        />
      </Section>
    );
  };

  const IdTokensToBeSubmitted = () => {
    const idToken = manifestState.input.attestations.idTokens[0];
    const hostname = Linking.parse(idToken.configuration).hostname as string;
    return (
      <Card>
        <Card.Title>Sign-in Required</Card.Title>
        <Card.Divider />
        <Button
          type="outline"
          disabled={idTokenState !== ""}
          title={hostname}
          onPress={() => authenticate(idToken.configuration, idToken.client_id)}
        />
      </Card>
    );
  };

  const CredentialsToBeSubmitted = () => {
    return (
      <Card>
        <Card.Title>Credentials Required</Card.Title>
        <Card.Divider />
        <Credential
          title={presentaionManifestState.display.card.title}
          icon={presentaionManifestState.display.card.logo.uri}
          issuedBy={presentaionManifestState.display.card.issuedBy}
          textColor={presentaionManifestState.display.card.textColor}
          backgroundColor={
            presentaionManifestState.display.card.backgroundColor
          }
          size="40"
        />
      </Card>
    );
  };

  const home = () => {
    window.location.href = window.location.href.split(/[?#]/)[0];
    navigation.navigate("Home");
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Layout>
        <Header
          leftComponent={{ icon: "chevron-left", color: "#fff", onPress: home }}
          centerComponent={{
            text:
              modeState === "receive"
                ? "Receive Credentials"
                : "Present Credentials",
            style: { color: "#fff" },
          }}
        />

        <Container>
          <CredentialsToBeIssued />
          <Divider />
          {manifestState.input.attestations.idTokens && modeState!=="present" && (
            <IdTokensToBeSubmitted />
          )}
          {presentaionManifestState && <CredentialsToBeSubmitted />}
          <Button
            style={tailwind("m-4 mt-8")}
            title="Submit"
            // disabled={idTokenState === ""}
            onPress={submit}
          />
        </Container>
      </Layout>
    );
  }
};
