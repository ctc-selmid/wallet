import React from "react";
import { Text, View, Image } from "react-native";
import tailwind from "tailwind-rn";

type Props = {
  title: string;
  icon: string;
  issuedBy: string;
  textColor: string;
  backgroundColor: string;
  size?: string;
};

export default (props: Props) => {
  const size = props.size ? props.size : "48";

  return (
    <View
      style={[
        tailwind(`relative h-${size} rounded-lg`),
        {
          backgroundColor: props.backgroundColor,
        },
      ]}
    >
      <Image
        style={tailwind("absolute left-0 top-0 m-2 w-10 h-10 rounded-full")}
        source={{ uri: props.icon }}
      />
      <Text
        style={[
          tailwind("absolute top-0 right-0 m-4 text-lg"),
          {
            color: props.textColor,
          },
        ]}
      >
        {props.title}
      </Text>
      <Text
        style={[
          tailwind("absolute bottom-0 left-0 m-4 text-sm"),
          {
            color: props.textColor,
          },
        ]}
      >
        {props.issuedBy}
      </Text>
    </View>
  );
};
