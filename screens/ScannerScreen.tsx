import * as Linking from "expo-linking";
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Header } from "react-native-elements";
import { BarCodeScanner } from "expo-barcode-scanner";
import QrReader from "react-qr-reader";

export default ({ navigation }) => {
  const handleBarCodeScannerScanned = ({ data }) => {
    console.log(data);
  };

  const handleQrReaderScanned = (data) => {
    if (!data) {
      return;
    }
    const { queryParams } = Linking.parse(data);
    if (!queryParams) {
      return;
    }
    window.location.href = `${window.location.href}?request_uri=${queryParams.request_uri}`;
  };

  const handleQrReaderError = (err) => {
    console.log(err);
  };

  const home = () => {
    navigation.navigate("Home");
  };

  return (
    <>
      <Header
        leftComponent={{ icon: "chevron-left", color: "#fff", onPress: home }}
        centerComponent={{
          text: "Scan QR Code",
          style: { color: "#fff" },
        }}
        rightComponent={{ icon: "menu", color: "#fff" }}
      />
      {Platform.OS !== "web" ? (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScannerScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      ) : (
        <QrReader
          onError={handleQrReaderError}
          onScan={handleQrReaderScanned}
        />
      )}
    </>
  );
};
