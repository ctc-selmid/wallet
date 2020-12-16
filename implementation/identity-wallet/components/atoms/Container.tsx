import React from "react";
import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default (props: Props) => {
  return <View>{props.children}</View>;
};
