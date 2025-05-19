import type { Meta, StoryObj } from '@storybook/react';
import { DifficultyFilter } from './difficulty-filter';

const meta: Meta<typeof DifficultyFilter> = {
  title: 'Components/DifficultyFilter',
  component: DifficultyFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DifficultyFilter>;

export const Default: Story = {
  args: {
    selectedDifficulties: {
      easy: true,
      medium: true,
      hard: true,
    },
    onDifficultyChange: () => {},
  },
};

export const AllUnchecked: Story = {
  args: {
    selectedDifficulties: {
      easy: false,
      medium: false,
      hard: false,
    },
    onDifficultyChange: () => {},
  },
};

export const OnlyEasy: Story = {
  args: {
    selectedDifficulties: {
      easy: true,
      medium: false,
      hard: false,
    },
    onDifficultyChange: () => {},
  },
}; 