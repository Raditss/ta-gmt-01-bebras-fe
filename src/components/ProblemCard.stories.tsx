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
    title: 'Simple Context-Free Grammar',
    author: 'John Doe',
    difficulty: 'EASY',
    category: 'Context-Free Grammar',
  },
};

export const Medium: Story = {
  args: {
    id: '2',
    title: 'Intermediate Decision Tree',
    author: 'Jane Smith',
    difficulty: 'MEDIUM',
    category: 'Decision Tree',
  },
};

export const Hard: Story = {
  args: {
    id: '3',
    title: 'Advanced Algorithm Challenge',
    author: 'Bob Johnson',
    difficulty: 'HARD',
    category: 'Multiple Choice',
  },
}; 