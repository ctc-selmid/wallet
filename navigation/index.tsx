import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { ScreenContext } from "../contexts";
import HomeScreen from "../screens/HomeScreen";
import ResponseScreen from "../screens/ResponseScreen";
import CredentialScreen from "../screens/CredentialScreen";
import ScannerScreen from "../screens/ScannerScreen";
import SigninScreen from "../screens/SigninScreen";
import SettingScreen from "../screens/SettingScreen";

const Stack = createStackNavigator();

export default () => {
  const mode = React.useContext(ScreenContext) as string;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={mode}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Response" component={ResponseScreen} />
        <Stack.Screen name="Credential" component={CredentialScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
