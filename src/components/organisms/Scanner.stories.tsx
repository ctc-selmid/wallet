import { Story, Meta } from "@storybook/react/types-6-0";

import { Scanner as Component, ScannerProps as Props } from "./Scanner";

export default {
  title: "Organisms/Scanner",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Scanner = Template.bind({});

Scanner.args = {
  onQRCodeScanned: (requestUrl: string) => {
    console.log("scanned", requestUrl);
  },
};
