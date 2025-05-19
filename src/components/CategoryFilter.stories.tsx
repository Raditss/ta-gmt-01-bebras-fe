import type { Meta, StoryObj } from '@storybook/react';
import { CategoryFilter } from './category-filter';
import { Inter } from 'next/font/google'

const meta: Meta<typeof CategoryFilter> = {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

const inter = Inter({ subsets: ['latin'] })

export const Default: Story = {
  args: {
    selectedCategories: {
      cipher: true,
      binaryTree: false,
      balanced: false,
      algorithms: false,
      dataStructures: false,
      dynamicProgramming: false,
    },
    onCategoryChange: () => {},
  },
};

export const AllUnchecked: Story = {
  args: {
    selectedCategories: {
      cipher: false,
      binaryTree: false,
      balanced: false,
      algorithms: false,
      dataStructures: false,
      dynamicProgramming: false,
    },
    onCategoryChange: () => {},
  },
};

export const OnlyCipher: Story = {
  args: {
    selectedCategories: {
      cipher: true,
      binaryTree: false,
      balanced: false,
      algorithms: false,
      dataStructures: false,
      dynamicProgramming: false,
    },
    onCategoryChange: () => {},
  },
};

export const MixedSelection: Story = {
  args: {
    selectedCategories: {
      cipher: true,
      binaryTree: false,
      balanced: true,
      algorithms: false,
      dataStructures: true,
      dynamicProgramming: false,
    },
    onCategoryChange: () => {},
  },
}; 