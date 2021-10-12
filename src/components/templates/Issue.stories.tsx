import { Meta, Story } from "@storybook/react/types-6-0";

import { acquiredAttestation, manifest, vcIssueRequest } from "../../fixtures";
import { IssueTemplate as Component, IssueTemplateProps as Props } from "./Issue";

export default {
  title: "Templates/Issue",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const IssueBeforeAuthorization = Template.bind({});
IssueBeforeAuthorization.args = {
  vcRequest: vcIssueRequest,
  manifest,
};

export const IssueAfterAuthorization = Template.bind({});
IssueAfterAuthorization.args = {
  vcRequest: vcIssueRequest,
  manifest,
  acquiredAttestation,
};
