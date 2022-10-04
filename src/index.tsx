if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

import { EVENTS, createInitialValues } from "./constants";

import React, { useEffect, useMemo, useCallback } from "react";
import { useArgs } from "@storybook/client-api";
import { Provider } from "jotai";
import { useAtomValue, useAtomCallback } from "jotai/utils";
import type { Atom } from "jotai";

import addons, { makeDecorator } from "@storybook/addons";

type ParameterItem = {
  atom: Atom<unknown>;
  getValue: (args: any) => any;
};

type AtomHash = {
  [key: string]: ParameterItem;
};

const Wrapper = ({
  atoms,
  children,
  args,
}: {
  atoms: AtomHash;
  children: any;
  args: any;
}) => {
  const channel = addons.getChannel();

  const useAtoms: AtomHash = {};
  Object.entries(atoms).forEach(([key, { atom }]: [string, ParameterItem]) => {
    useAtoms[key] = useAtomValue(atom) as any;
  });

  const atomValues: any = {};

  for (const [key, { atom }] of Object.entries(atoms)) {
    atomValues[key] = atom;
  }

  const setAtom = useAtomCallback(
    useCallback(
      (get: any, set: any, { atom, value }: any) => {
        set(atom, value);
      },
      [atoms]
    )
  );

  useEffect(() => {
    for (const { atom, getValue } of Object.values<any>(atoms)) {
      setAtom({
        atom,
        value: getValue(args),
      });
    }
  }, [args]);

  useEffect(() => {
    channel.emit(EVENTS.ATOMS_CHANGED, useAtoms);
  }, [atoms, useAtoms, atomValues]);

  return children;
};

export const withJotai = makeDecorator({
  name: "withJotai",
  parameterName: "jotai",
  skipIfNoParametersOrOptions: false, // Needs to be false so values get cleared
  wrapper: (storyFn, context, { parameters }) => {
    const channel = addons.getChannel();

    if (!parameters) {
      channel.emit(EVENTS.RENDERED, { note: "withJotai decorator not used" });
      return storyFn(context);
    }

    const { get, set } = createInitialValues();

    const initialValues = useMemo(get, [get]);

    const [args, ,] = useArgs();

    useEffect(() => {
      for (const { atom, getValue } of Object.values(parameters)) {
        set(atom, getValue(args));
      }

      const values: any = {};
      for (const [key, { getValue }] of Object.entries(parameters)) {
        values[key] = getValue(args);
      }

      channel.emit(EVENTS.RENDERED, values);
    }, []);

    return (
      <Provider initialValues={initialValues}>
        <Wrapper atoms={parameters} args={args}>
          {storyFn(context)}
        </Wrapper>
      </Provider>
    );
  },
});
export default withJotai;
