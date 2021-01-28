import * as React from "react";
import { Text, Input, Card, Button, Divider } from "react-native-elements";
import tailwind from "tailwind-rn";
import Container from "../components/atoms/Container";
import Layout from "../components/atoms/Layout";
import AsyncStorage from "@react-native-community/async-storage";

import { generatePrivateKey } from "../modules";

export default ({ navigation }) => {
  const [key, setKey] = React.useState("");
  const [error, setError] = React.useState(false);

  const home = () => {
    navigation.navigate("Home");
  };

  const handleChangeKey = (value: string) => {
    if (value && value.length !== 64) {
      setError(true);
    } else {
      setError(false);
    }
    setKey(value);
  };

  const createKey = () => {
    const privateKey = generatePrivateKey();
    AsyncStorage.setItem("@private_key", privateKey);
    home();
  };

  const recoveryKey = () => {
    if (!key || error) return;
    AsyncStorage.setItem("@private_key", key);
    setKey("");
    home();
  };

  return (
    <Layout>
      <Container>
        <Card>
          <Text h1 style={tailwind("m-4 text-5xl")}>
            Signin
          </Text>
          <Text style={tailwind("m-4 mt-6 text-lg text-gray-500")}>
            Create Account
          </Text>
          <Button
            title="Create"
            style={tailwind("m-4 mb-6")}
            onPress={createKey}
          />
          <Divider />
          <Text style={tailwind("m-4 mt-8 text-lg text-gray-500")}>
            Recovery Account
          </Text>
          <Input
            value={key}
            placeholder="PrivateKey"
            style={tailwind(
              "mx-2 my-3 px-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-300 rounded-md"
            )}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            errorStyle={error ? { color: "red" } : undefined}
            errorMessage={
              error ? "PrivateKeyの形式ではありません。" : undefined
            }
            onChangeText={(value) => handleChangeKey(value)}
          />
          <Button
            title="Recovery"
            style={tailwind("m-4")}
            onPress={recoveryKey}
          />
        </Card>
      </Container>
    </Layout>
  );
};
