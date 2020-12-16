import * as React from "react";
import { Text, Card, Divider, Header } from "react-native-elements";
import tailwind from "tailwind-rn";
import Container from "../components/atoms/Container";
import Layout from "../components/atoms/Layout";
import Section from "../components/atoms/Section";
import Credential from "../components/molecules/Credential";

import { initializeHome } from "../hooks";
import { jwt } from "../modules";

export default ({ route, navigation }) => {
  const { vcState } = initializeHome();
  const Credentials = () => {
    if (!vcState) {
      return null;
    } else {
      const { key } = route.params;
      const cardOne = vcState[key];

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
              {Object.keys(subject).map((key) => (
                <Card key={key}>
                  <Text
                    style={[tailwind("text-xm p-2")]}
                  >{`${key}: ${subject[key]}`}</Text>
                </Card>
              ))}
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
