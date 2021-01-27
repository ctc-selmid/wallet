import * as React from "react";
import { Clipboard } from "react-native";
import { Card, Button, Divider, Header } from "react-native-elements";
import tailwind from "tailwind-rn";
import Container from "../components/atoms/Container";
import Layout from "../components/atoms/Layout";
import AsyncStorage from "@react-native-community/async-storage";

export default ({ navigation }) => {
  const home = () => {
    navigation.navigate("Home");
  };

  const exportKey = async () => {
    let privateKey = await AsyncStorage.getItem("@private_key");
    if (!privateKey) return;
    Clipboard.setString(privateKey);
    alert("Copied");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@private_key");
    navigation.navigate("Signin");
  };

  return (
    <Layout>
      <Header
        leftComponent={{ icon: "chevron-left", color: "#fff", onPress: home }}
        centerComponent={{
          text: "Setting",
          style: { color: "#fff" },
        }}
      />
      <Container>
        <Card>
          <Button
            title="Export private key"
            type="clear"
            style={tailwind("mb-4")}
            onPress={exportKey}
          />
          <Divider />
          <Button
            title="Log out"
            type="clear"
            style={tailwind("m-2")}
            onPress={logout}
          />
        </Card>
      </Container>
    </Layout>
  );
};
