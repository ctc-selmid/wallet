import { Story, Meta } from "@storybook/react/types-6-0";

import { Header as Component, HeaderProps as Props } from "./Header";

export default {
  title: "Organisms/Header",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Header = Template.bind({});
