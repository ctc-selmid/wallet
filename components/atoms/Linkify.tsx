import React from "react";
import { Image } from "react-native-elements";
import Autolink from "react-native-autolink";
import tailwind from "tailwind-rn";

type Props = {
  children: React.ReactNode;
  imageWidth?: number;
  imageHeight?: number;
};

const formats = [".png", ".jpeg", ".jpg"];

const getMatchedIamgeUrl = (url: string): boolean => {
  const matched = formats.filter((format) => {
    const reg = new RegExp(format);
    return url.match(reg);
  });
  if (!matched.length) return false;
  return true;
};

export default ({ children, imageWidth, imageHeight }: Props) => {
  if (!children) return null;
  const text = children.toString();
  console.log(text);
  return (
    <Autolink
      text={text}
      renderLink={(text, match) => {
        const url = match.getAnchorHref();
        if (!getMatchedIamgeUrl(url)) return <Autolink text={url} />;
        return (
          <Image
            source={{ uri: url }}
            style={[
              tailwind("object-fill"),
              { width: imageWidth, height: imageHeight },
            ]}
          />
        );
      }}
    />
  );
};
