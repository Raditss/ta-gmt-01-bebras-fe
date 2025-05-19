import type { Meta, StoryObj } from '@storybook/react';
import { MainNavbar } from './main-navbar';
import { useAuth } from '@/lib/auth';

const meta: Meta<typeof MainNavbar> = {
  title: 'Components/MainNavbar',
  component: MainNavbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MainNavbar>;

export const Default: Story = {
  args: {
    user: null,
    isAuthenticated: false,
    logout: () => {},
  },
};

export const LoggedIn: Story = {
  args: {
    user: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      points: 100,
      rank: 1,
      problemsSolved: 5,
    },
    isAuthenticated: true,
    logout: () => {},
  },
};
