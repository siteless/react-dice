import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';

import { Dice } from '../Dice';
import '../styles.css';

type StoryType = ComponentProps<typeof Dice>;

const meta: Meta<StoryType> = {
  title: 'Dice',
  component: Dice,
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
};

export const InitialValue: Story = {
  args: {
    initialValue: 3,
  },
};

export const CustomStyles: Story = {
  args: {
    borderColor: '#1d0b51',
    backgroundColor: '#3c138b',
    borderWidth: 2,
    borderRadius: 20,
    pipColor: '#de7ac7',
    initialValue: 5,
  },
};

export const AsyncGetNextValue: Story = {
  args: {
    getNextValue: async () => {
      const diceApiUrl = 'https://www.dejete.com/api?nbde=1&tpde=6';
      const response = await fetch(diceApiUrl);
      const data = await response.json();
      return data[0].value as number;
    },
  },
};
