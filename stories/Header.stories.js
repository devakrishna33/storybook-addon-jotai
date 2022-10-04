import React from "react";

import { withJotai } from "../dist/esm";
import { userAtom } from "../dist/esm/constants";

import { Header } from "./Header";

export default {
  title: "Example/Header",
  component: Header,
  decorators: [withJotai],
  args: {
    name: "John",
  },
};

const Template = (args) => <Header {...args} />;

export const JohnLoggedIn = Template.bind({});
JohnLoggedIn.parameters = {
  jotai: {
    user: {
      atom: userAtom,
      getValue: (args) => ({
        name: args.name,
      }),
    },
  },
};

export const JaneLoggedIn = Template.bind({});
JaneLoggedIn.parameters = {
  jotai: {
    user: {
      atom: userAtom,
      getValue: (args) => ({
        name: args.name,
      }),
    },
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
