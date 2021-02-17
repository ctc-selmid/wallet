import React from "react";
import { Linking } from "react-native";
import Autolink from "react-native-autolink";

type Props = {
  children: React.ReactNode;
};

export default ({ children }: Props) => {
  if (!children) return null;
  return (
    <Autolink
      text={children.toString()}
      onPress={async (url) => await Linking.openURL(url)}
    />
  );
};
