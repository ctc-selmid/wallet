import { Story, Meta } from "@storybook/react/types-6-0";

import { Credential as Component, CredentialProps as Props } from "./Credential";

export default {
  title: "Templates/Credential",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Credential = Template.bind({});
