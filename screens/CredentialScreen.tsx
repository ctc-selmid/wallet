import * as React from "react";
import { Image } from "react-native";
import { Text, Card, Divider, Header } from "react-native-elements";
import tailwind from "tailwind-rn";
import Container from "../components/atoms/Container";
import Layout from "../components/atoms/Layout";
import Linkify from "../components/atoms/Linkify";
import Section from "../components/atoms/Section";
import Credential from "../components/molecules/Credential";
import AsyncStorage from "@react-native-community/async-storage";

import { initializeHome } from "../hooks";
import { jwt, getIamgeUrlInText } from "../modules";

export default ({ route, navigation }) => {
  const { vcState } = initializeHome();

  const deleteCredential = async (credentialType, iss) => {
    const original = await AsyncStorage.getItem("@vc");
    let parsed;
    if (original) {
      parsed = JSON.parse(original);
    }
    delete parsed[credentialType][iss];
    const vc = parsed;
    await AsyncStorage.setItem("@vc", JSON.stringify(vc));
    navigation.navigate("Home");
  };

  const Credentials = () => {
    if (!vcState) {
      return null;
    } else {
      const { credentialType, iss } = route.params;
      const cardOne = vcState[credentialType][iss];
      const decoded = jwt.decode(cardOne.vc);
      const subject = decoded.vc.credentialSubject;

      return (
        <>
          {cardOne && (
            <>
              <Section>
                <Credential
                  title={cardOne.card.title}
                  icon={cardOne.card.logo.uri}
                  issuedBy={cardOne.card.issuedBy}
                  textColor={cardOne.card.textColor}
                  backgroundColor={cardOne.card.backgroundColor}
                />
              </Section>
              <Divider />
              {Object.keys(subject).map((key) => {
                const imageUrl = getIamgeUrlInText(subject[key]);
                return (
                  <Card key={key}>
                    <Text style={[tailwind("text-sm")]}>
                      <Linkify>{`${key}: ${subject[key]}`}</Linkify>
                    </Text>
                    {imageUrl && (
                      <Image
                        source={{ uri: imageUrl }}
                        style={[tailwind("w-full h-56 mt-3")]}
                      />
                    )}
                  </Card>
                );
              })}
              <Text
                onPress={() => deleteCredential(credentialType, iss)}
                style={[tailwind("text-center text-xs text-red-600 mt-8")]}
              >
                Delete Credential
              </Text>
            </>
          )}
          {}
        </>
      );
    }
  };

  const home = () => {
    navigation.navigate("Home");
  };

  const scnanner = () => {
    navigation.navigate("Scanner");
  };

  return (
    <Layout>
      <Header
        leftComponent={{ icon: "chevron-left", color: "#fff", onPress: home }}
        centerComponent={{
          text: "Credential Detail",
          style: { color: "#fff" },
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
