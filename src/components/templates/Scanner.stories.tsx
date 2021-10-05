import { Story, Meta } from "@storybook/react/types-6-0";

import { ScannerTemplate as Component, ScannerTemplateProps as Props } from "./Scanner";

export default {
  title: "Templates/Scanner",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Scanner = Template.bind({});
