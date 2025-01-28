import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { ComponentProps } from 'react';
import { Dice } from '../Dice';

import { DiceGroup } from '../DiceGroup';

type StoryType = ComponentProps<typeof DiceGroup>;

const meta: Meta<StoryType> = {
  title: 'DiceGroup',
  component: DiceGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
};

export default meta;

type Story = StoryObj<StoryType>;

export const Basic: Story = {
  args: {},
  render: args => {
    return (
      <DiceGroup
        onChange={args.onChange}
        style={{ display: 'flex', gap: '1rem' }}
      >
        <Dice />
        <Dice />
      </DiceGroup>
    );
  },
};

export const Disabled: Story = {
  render: args => {
    return (
      <DiceGroup
        disabled
        onChange={args.onChange}
        style={{ display: 'flex', gap: '1rem' }}
      >
        <Dice initialValue={2} />
        <Dice initialValue={4} />
      </DiceGroup>
    );
  },
};
