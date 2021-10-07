import { Meta, Story } from "@storybook/react/types-6-0";

import { Home as Component, HomeProps as Props } from "./Home";

export default {
  title: "Organisms/Home",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Home = Template.bind({});
