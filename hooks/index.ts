import * as Linking from "expo-linking";
import {
  useFonts,
  NotoSansJP_400Regular,
  NotoSansJP_700Bold,
} from "@expo-google-fonts/noto-sans-jp";
import * as React from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import axios from "axios";

import { generatePrivateKey, jwt } from "../modules";

export const appendCorsAnywhere = (os, url) => {
  return os === "web" ? `https://cors-anywhere.herokuapp.com/${url}` : url;
};

export const initializeApp = () => {
  const [privateKeyState, setPrivateKeyState] = React.useState("");
  const [screenState, setScreenState] = React.useState("");

  const [isFontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  const loadPrivateKeyAsync = async () => {
    let privateKey = await AsyncStorage.getItem("@private_key");
    if (!privateKey) {
      privateKey = generatePrivateKey();
      AsyncStorage.setItem("@private_key", privateKey);
    }
    setPrivateKeyState(privateKey);
  };

  const loadScreenAsync = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (!initialUrl) {
      return;
    }
    const { queryParams } = Linking.parse(initialUrl);
    if (!queryParams || Object.keys(queryParams).length === 0) {
      setScreenState("Home");
      return;
    }

    if (queryParams.request_uri) {
      const requestResponse = await axios.get(
        appendCorsAnywhere(Platform.OS, queryParams.request_uri)
      );

      const request = requestResponse.data;
      const decodedRequest = jwt.decode(request);
      await AsyncStorage.setItem("@request", JSON.stringify(decodedRequest));
      if (decodedRequest.prompt === "create") {
        await AsyncStorage.setItem("@mode", "receive");
        const manifestUri =
        decodedRequest.presentation_definition.input_descriptors[0].issuance[0]
          .manifest;
        const manifestResponse = await axios.get(
          appendCorsAnywhere(Platform.OS, manifestUri)
        );
        const manifest = manifestResponse.data;
        await AsyncStorage.setItem("@manifest", JSON.stringify(manifest));
      } else {
        await AsyncStorage.setItem("@mode", "present");
      } 
    }
    setScreenState("Response");
  };

  React.useEffect(() => {
    loadPrivateKeyAsync();
    loadScreenAsync();
  }, []);

  return { isFontsLoaded, privateKeyState, screenState };
};

export const initializeResponse = () => {
  const [modeState, setModeState] = React.useState("");
  const [requestState, setRequestState] = React.useState<any>();
  const [manifestState, setManifestState] = React.useState<any>();
  const [
    presentaionManifestState,
    setPresentaionManifestState,
  ] = React.useState<any>();
  const [idTokenState, setIdTokenState] = React.useState("");
  const [vcState, setVcState] = React.useState<any>();

  React.useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (!initialUrl) {
        return;
      }

      const { queryParams } = Linking.parse(initialUrl);
      if (!queryParams || Object.keys(queryParams).length === 0) {
        return;
      }

      const manifestString = await AsyncStorage.getItem("@manifest");
      if (!manifestString) {
        return;
      }

      const manifest = JSON.parse(manifestString);
      setManifestState(manifest);

      if (queryParams.code) {
        const openIdConfigurationResponse = await axios.get(
          manifest.input.attestations.idTokens[0].configuration
        );
        const openIdConfiguration = openIdConfigurationResponse.data;
        const tokenResponse = await axios.get(
          `${openIdConfiguration.token_endpoint}&grant_type=authorization_code&code=${queryParams.code}`
        );
        const idToken = tokenResponse.data.id_token;
        setIdTokenState(idToken);
      }

      let presentationManifest;
      if (manifest.input.attestations.presentations) {
        const presentationManifestResponse = await axios.get(
          manifest.input.attestations.presentations[0].contracts[0]
        );
        presentationManifest = presentationManifestResponse.data;
        setPresentaionManifestState(presentationManifest);
      }

      const mode = await AsyncStorage.getItem("@mode");
      if (!mode) {
        return;
      }
      setModeState(mode);

      const requestString = await AsyncStorage.getItem("@request");
      if (!requestString) {
        return;
      }
      const request = JSON.parse(requestString);
      setRequestState(request);

      const vcString = await AsyncStorage.getItem("@vc");
      if (vcString && (presentationManifest || mode==="present")) {
        let key 
        if(mode==="present"){
          key = request.presentation_definition.input_descriptors[0].schema.uri[0]
        }
        else if(mode==="receive"){
          key = manifest.input.attestations.presentations[0].credentialType
        }
        const vc = JSON.parse(vcString);
        setVcState(
          vc[key]
        );
      }

    })();
  }, []);
  return {
    manifestState,
    requestState,
    modeState,
    idTokenState,
    vcState,
    presentaionManifestState,
  };
};

export const initializeHome = () => {
  const [vcState, setVcState] = React.useState<any>();

  React.useEffect(() => {
    (async () => {
      const vcString = await AsyncStorage.getItem("@vc");
      if (!vcString) {
        return;
      }
      const vc = JSON.parse(vcString);
      setVcState(vc);
    })();
  }, []);
  return { vcState };
};
