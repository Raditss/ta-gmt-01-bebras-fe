import type { Meta, StoryObj } from '@storybook/react';
import { ProblemCard } from './problem-card';

const meta: Meta<typeof ProblemCard> = {
  title: 'Components/ProblemCard',
  component: ProblemCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProblemCard>;

export const Easy: Story = {
  args: {
    id: '1',
    title: 'Two Sum',
    author: 'John Doe',
    difficulty: 'Easy',
    category: 'Array',
  },
};

export const Medium: Story = {
  args: {
    id: '2',
    title: 'Add Two Numbers',
    author: 'Jane Smith',
    difficulty: 'Medium',
    category: 'Linked List',
  },
};

export const Hard: Story = {
  args: {
    id: '3',
    title: 'Median of Two Sorted Arrays',
    author: 'Alex Johnson',
    difficulty: 'Hard',
    category: 'Array',
  },
}; 