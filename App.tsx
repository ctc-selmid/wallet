import "./polyfills/global";

import { AppLoading } from "expo";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "react-native-elements";

import { WalletContext, ScreenContext } from "./contexts";
import { initializeApp } from "./hooks";
import { Wallet } from "./modules";
import Navigation from "./navigation";

export default () => {
  const { isFontsLoaded, privateKeyState, screenState } = initializeApp();

  const isLoadingComplete = isFontsLoaded && privateKeyState && screenState;
  if (!isLoadingComplete) {
    return <AppLoading />;
  } else {
    const wallet = new Wallet(privateKeyState);
    console.log(wallet);
    return (
      <ThemeProvider>
        <WalletContext.Provider value={new Wallet(privateKeyState)}>
          <ScreenContext.Provider value={screenState}>
            <SafeAreaProvider>
              <Navigation />
              <StatusBar />
            </SafeAreaProvider>
          </ScreenContext.Provider>
        </WalletContext.Provider>
      </ThemeProvider>
    );
  }
};
