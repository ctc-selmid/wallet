import React from "react";
import { Linking } from "react-native";
import Hyperlink from "react-native-hyperlink";

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  return (
    <Hyperlink
      linkDefault={true}
      linkStyle={{ color: "#2980b9" }}
      onPress={async (url) => await Linking.openURL(url)}
    >
      {children}
    </Hyperlink>
  );
};
