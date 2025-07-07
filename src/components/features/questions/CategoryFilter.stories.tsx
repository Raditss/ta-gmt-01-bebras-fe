import type { Meta, StoryObj } from '@storybook/react';
import { QuestionTypeFilter } from './question-type-filter';
import { Inter } from 'next/font/google'

const meta: Meta<typeof QuestionTypeFilter> = {
  title: 'Components/CategoryFilter',
  component: QuestionTypeFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuestionTypeFilter>;

const inter = Inter({ subsets: ['latin'] })

export const Default: Story = {
  args: {
    selectedQuestionTypes: {
      cipher: true,
      binaryTree: false,
      balanced: false,
      algorithms: false,
      dataStructures: false,
      dynamicProgramming: false,
    },
    onQuestionTypeChange: () => {},
  },
};

export const AllUnchecked: Story = {
  args: {
    selectedQuestionTypes: {
      cipher: false,
      binaryTree: false,
      balanced: false,
      algorithms: false,
      dataStructures: false,
      dynamicProgramming: false,
    },
    onQuestionTypeChange: () => {},
  },
};

export const OnlyCipher: Story = {
  args: {
    selectedQuestionTypes: {
      cipher: true,
      binaryTree: false,
      balanced: false,
      algorithms: false,
      dataStructures: false,
      dynamicProgramming: false,
    },
    onQuestionTypeChange: () => {},
  },
};

export const MixedSelection: Story = {
  args: {
    selectedQuestionTypes: {
      cipher: true,
      binaryTree: false,
      balanced: true,
      algorithms: false,
      dataStructures: true,
      dynamicProgramming: false,
    },
    onQuestionTypeChange: () => {},
  },
}; 