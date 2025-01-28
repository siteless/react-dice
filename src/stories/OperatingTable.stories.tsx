import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useEffect, useState, ComponentProps, useMemo } from 'react';

import { Dice, DiceValue } from '../Dice';

type StoryArgs = {
  baseValue?: DiceValue;
  cycleValues?: boolean;
  cycleToValues?: DiceValue[];
};
type StoryType = ComponentProps<typeof Dice> & StoryArgs;

const CycleThroughContainer = ({
  baseValue,
  cycleValues,
  cycleToValues,
}: StoryArgs) => {
  const [value, setValue] = useState<DiceValue>(baseValue || 1);

  const [currentValueCycleIndex, setCurrentValueCycleIndex] = useState(0);
  const valueCycle = useMemo(
    () =>
      (baseValue
        ? cycleToValues?.map(v => [baseValue, v]).flat()
        : cycleToValues) || [],
    [cycleToValues, baseValue],
  );

  useEffect(() => {
    if (!cycleValues) return;

    const interval = setInterval(() => {
      setCurrentValueCycleIndex(i => (i + 1) % valueCycle.length);
      setValue(valueCycle[currentValueCycleIndex]);
    }, 1000);

    return () => clearInterval(interval);
  }, [cycleValues, valueCycle, currentValueCycleIndex]);

  return <Dice />;
};

const meta: Meta<StoryType> = {
  title: 'OperatingTable',
  component: Dice,
  parameters: {
    layout: 'centered',
  },
  args: { onChange: fn() },
  argTypes: {
    cycleToValues: { control: 'check', options: [1, 2, 3, 4, 5, 6] },
  },
  render: props => <CycleThroughContainer {...props} />,
};

export default meta;

type Story = StoryObj<StoryType>;

export const Basic: Story = {
  args: {
    baseValue: 1,
    cycleValues: true,
  },
};
