import React from "react";
import { View } from "react-native";
import tailwind from "tailwind-rn";

type Props = {
  children: React.ReactNode;
};

export default (props: Props) => {
  return <View style={tailwind("p-4")}>{props.children}</View>;
};
