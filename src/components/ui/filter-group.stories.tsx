import type { Meta, StoryObj } from '@storybook/react';
import { FilterGroup } from './filter-group';

const meta: Meta<typeof FilterGroup> = {
  title: 'UI/FilterGroup',
  component: FilterGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FilterGroup>;

const sampleOptions = [
  { id: 'option1', label: 'Option 1' },
  { id: 'option2', label: 'Option 2' },
  { id: 'option3', label: 'Option 3' },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    selectedOptions: {
      option1: true,
      option2: false,
      option3: true,
    },
    onChange: (id) => console.log('Changed:', id),
    title: 'Filter Options',
  },
};

export const NoTitle: Story = {
  args: {
    options: sampleOptions,
    selectedOptions: {
      option1: true,
      option2: false,
      option3: true,
    },
    onChange: (id) => console.log('Changed:', id),
  },
};

export const AllSelected: Story = {
  args: {
    options: sampleOptions,
    selectedOptions: {
      option1: true,
      option2: true,
      option3: true,
    },
    onChange: (id) => console.log('Changed:', id),
    title: 'All Selected',
  },
};

export const NoneSelected: Story = {
  args: {
    options: sampleOptions,
    selectedOptions: {
      option1: false,
      option2: false,
      option3: false,
    },
    onChange: (id) => console.log('Changed:', id),
    title: 'None Selected',
  },
}; 