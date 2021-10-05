import { Story, Meta } from "@storybook/react/types-6-0";

import { IssueTemplate as Component, IssueTemplateProps as Props } from "./Issue";

export default {
  title: "Templates/Issue",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const Issue = Template.bind({});
