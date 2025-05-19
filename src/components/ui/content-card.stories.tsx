import type { Meta, StoryObj } from '@storybook/react';
import { ContentCard } from './content-card';

const meta: Meta<typeof ContentCard> = {
  title: 'UI/ContentCard',
  component: ContentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Default: Story = {
  args: {
    id: '1',
    title: 'Sample Content',
    author: 'John Doe',
    tags: [
      { label: 'Category', variant: 'outline', className: 'bg-gray-100' },
      { label: 'Status', className: 'bg-green-100 text-green-800' },
    ],
    footer: {
      action: {
        label: 'View Details',
        href: '/details/1',
        className: 'bg-[#F8D15B] text-black hover:bg-[#E8C14B]',
      },
    },
  },
};

export const WithTextFooter: Story = {
  args: {
    id: '2',
    title: 'Content with Text Footer',
    author: 'Jane Smith',
    tags: [
      { label: 'Category', variant: 'outline', className: 'bg-gray-100' },
      { label: 'Status', className: 'bg-yellow-100 text-yellow-800' },
    ],
    footer: {
      text: 'Last updated 2 days ago',
    },
  },
};

export const NoFooter: Story = {
  args: {
    id: '3',
    title: 'Content without Footer',
    author: 'Alex Johnson',
    tags: [
      { label: 'Category', variant: 'outline', className: 'bg-gray-100' },
      { label: 'Status', className: 'bg-red-100 text-red-800' },
    ],
  },
};

export const MultipleTags: Story = {
  args: {
    id: '4',
    title: 'Content with Multiple Tags',
    author: 'Sarah Wilson',
    tags: [
      { label: 'Category', variant: 'outline', className: 'bg-gray-100' },
      { label: 'Status', className: 'bg-green-100 text-green-800' },
      { label: 'Priority', className: 'bg-blue-100 text-blue-800' },
    ],
    footer: {
      action: {
        label: 'View Details',
        href: '/details/4',
        className: 'bg-[#F8D15B] text-black hover:bg-[#E8C14B]',
      },
    },
  },
}; 