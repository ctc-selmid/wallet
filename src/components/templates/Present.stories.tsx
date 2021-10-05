import { Story, Meta } from "@storybook/react/types-6-0";

import { PresentTemplate as Component, PresentTemplateProps as Props } from "./Present";

export default {
  title: "Templates/Present",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Present = Template.bind({});
