import React from 'react';
import type { StoryFn } from '@storybook/react';

export const withMockData = (Story: StoryFn, context: any) => {
  if (context.parameters.mockData) {
    (window as any).__STORYBOOK_MOCK_DATA__ = context.parameters.mockData;
  }
  return <Story />;
}; 