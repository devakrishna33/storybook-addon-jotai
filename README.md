# Storybook Jotai Addon

A [Storybook](https://storybook.js.org/) Addon and Decorator for [Jotai](https://jotai.org) and track the state in a Panel.

TODO: Add screenshot here

## Install

```sh
yarn add -D storybook-addon-jotai
```

Register the addon in `.storybook/main.js`

```ts
module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["storybook-addon-jotai"],
};
```

## Usage

Given a simple component:

```tsx
import { useAtom, atom } from "jotai";

const userAtom = atom(null);

export const User = () => {
  const [user] = useAtom(userAtom);

  return (
    <div>
      {user ? (
        <div>
          <div>{`Logged in as ${user.name}`}</div>
          <Button size="small" label="Log out" onClick={() => setUser(null)} />
        </div>
      ) : (
        <div>
          <div>No one is signed in</div>
          <Button
            size="small"
            label="Log in"
            onClick={() => setUser({ name: "John" })}
          />
        </div>
      )}
    </div>
  );
};
```

You can write a story as

```tsx
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
```

### Development scripts

- `yarn start` runs babel in watch mode and starts Storybook
- `yarn build` build and package your addon code

## Release Management

### Creating a release

Automatically created when pushing to GitHub
