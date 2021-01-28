import * as React from "react";
import { View } from "react-native";
import { Header, Divider, Text } from "react-native-elements";

import tailwind from "tailwind-rn";

import Container from "../components/atoms/Container";
import Layout from "../components/atoms/Layout";
import Section from "../components/atoms/Section";
import Credential from "../components/molecules/Credential";
import { initializeHome } from "../hooks";

export default ({ navigation }) => {
  const { vcState } = initializeHome();

  const Credentials = () => {
    if (!vcState) {
      return null;
    } else {
      const Cards = Object.keys(vcState).map(
        (credentialType, credentialIndex) => {
          const issuer = vcState[credentialType];
          return Object.keys(issuer).map((iss, index) => {
            const { card } = issuer[iss];
            return (
              <View key={iss}>
                {(credentialIndex > 0 || index > 0) && (
                  <Divider style={tailwind("mx-2 my-4")} />
                )}
                <Credential
                  title={card.title}
                  icon={card.logo.uri}
                  issuedBy={card.issuedBy}
                  textColor={card.textColor}
                  backgroundColor={card.backgroundColor}
                />
                <Text
                  onPress={() => detail(credentialType, iss)}
                  style={[tailwind("text-center text-xs text-blue-600 mt-4")]}
                >
                  View detail
                </Text>
              </View>
            );
          });
        }
      );
      return <Section>{Cards}</Section>;
    }
  };

  const detail = (credentialType, iss) => {
    navigation.navigate("Credential", {
      credentialType,
      iss,
    });
  };

  const home = () => {
    window.location.href = window.location.href.split(/[?#]/)[0];
    navigation.navigate("Home");
  };

  const scnanner = () => {
    navigation.navigate("Scnanner");
  };

  const setting = () => {
    navigation.navigate("Setting");
  };

  return (
    <Layout>
      <Header
        centerComponent={{
          text: "Credentials",
          style: { color: "#fff" },
          onPress: home,
        }}
        leftComponent={{
          icon: "menu",
          color: "#fff",
          onPress: setting,
        }}
        rightComponent={{
          icon: "camera",
          color: "#fff",
          onPress: scnanner,
        }}
      />
      <Container>
        <Credentials />
      </Container>
    </Layout>
  );
};
