import type { Preview } from '@storybook/react';

// Import the AI chat theme styles
import '../src/styles/ai-chat-theme.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Panels', 'Components', '*'],
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#16161a' },
        { name: 'light', value: '#f5f5f5' },
      ],
    },
  },
};

export default preview;
