import { Story, Meta } from "@storybook/react/types-6-0";

import { Present as Component, PresentProps as Props } from "./Present";

export default {
  title: "Organisms/Present",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Present = Template.bind({});
