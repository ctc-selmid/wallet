import { Meta, Story } from "@storybook/react/types-6-0";

import { Issue as Component, IssueProps as Props } from "./Issue";

export default {
  title: "Organisms/Issue",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Issue = Template.bind({});
