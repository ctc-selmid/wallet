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
      const Cards = Object.keys(vcState).map((key, index) => {
        const { card } = vcState[key];
        return (
          <View key={key}>
            {index > 0 && <Divider style={tailwind("mx-2 my-4")} />}
            <Credential
              title={card.title}
              icon={card.logo.uri}
              issuedBy={card.issuedBy}
              textColor={card.textColor}
              backgroundColor={card.backgroundColor}
            />
            <Text
              onPress={() => detail(key)}
              style={[tailwind("text-center text-xs text-blue-600 mt-4")]}
            >
              View detail
            </Text>
          </View>
        );
      });
      return <Section>{Cards}</Section>;
    }
  };

  const detail = (key) => {
    navigation.navigate("Credential", {
      key: key,
    });
  };

  const scnanner = () => {
    navigation.navigate("Scanner");
  };

  const home = () => {
    window.location.href = window.location.href.split(/[?#]/)[0];
    navigation.navigate("Home");
  };

  return (
    <Layout>
      <Header
        centerComponent={{
          text: "Credentials",
          style: { color: "#fff" },
          onPress: home,
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
