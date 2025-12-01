import type { Meta, StoryObj } from '@storybook/react';
import { AIChatPanel } from '../components/AIChatPanel';
import type { AIChatPanelConfig } from '../types';
import {
  createMockAIProvider,
  createMockLocalProvider,
  MOCK_AVAILABLE_MODELS,
  mockPanelContext,
  mockPanelActions,
  mockPanelEvents,
  ThemeDecorator,
} from './mocks';

const meta: Meta<typeof AIChatPanel> = {
  title: 'Panels/AIChatPanel',
  component: AIChatPanel,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The AIChatPanel is a configurable AI chat interface that supports multiple providers.

## Features
- Provider selection UI (local vs cloud)
- Model selection for local providers
- Persistent provider preferences (localStorage)
- Industry theme integration
- Event emission for panel communication

## Usage

\`\`\`tsx
import { AIChatPanel, AIChatPanelConfig } from '@principal-ade/industry-themed-ai-sdk-panel';

const config: AIChatPanelConfig = {
  useLocalProvider: () => useWebLLM(),
  useCloudProvider: () => useGemini(),
  availableModels: AVAILABLE_MODELS,
};

<AIChatPanel
  config={config}
  context={panelContext}
  actions={panelActions}
  events={panelEvents}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AIChatPanel>;

// Config with both providers
const dualProviderConfig: AIChatPanelConfig = {
  useLocalProvider: createMockLocalProvider(),
  useCloudProvider: createMockAIProvider({
    responseDelay: 800,
    mockResponses: [
      "Hello from Cloud AI! I'm powered by a fast cloud model.",
      "I can help you with code analysis, debugging, and more.",
      "Here's a code suggestion:\n```typescript\nexport function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n```",
    ],
  }),
  availableModels: MOCK_AVAILABLE_MODELS,
  cloudProviderMeta: {
    name: 'Gemini Flash',
    description: 'Fast, capable cloud model with native function calling.',
  },
};

// Config with only local provider
const localOnlyConfig: AIChatPanelConfig = {
  useLocalProvider: createMockLocalProvider(),
  availableModels: MOCK_AVAILABLE_MODELS,
};

// Config with only cloud provider
const cloudOnlyConfig: AIChatPanelConfig = {
  useCloudProvider: createMockAIProvider({
    responseDelay: 500,
  }),
  cloudProviderMeta: {
    name: 'OpenAI GPT-4',
    description: 'Advanced reasoning and code generation.',
    badge: 'Premium',
    badgeVariant: 'warning',
  },
};

/**
 * Default configuration with both local and cloud providers.
 * Users can choose between running AI locally in their browser or using a cloud service.
 */
export const Default: Story = {
  args: {
    config: dualProviderConfig,
    context: mockPanelContext,
    actions: mockPanelActions,
    events: mockPanelEvents,
    placeholder: 'Ask me anything about your code...',
  },
};

/**
 * Configuration with only the local (browser-based) AI provider.
 * Shows the model selection screen after choosing local.
 */
export const LocalOnly: Story = {
  args: {
    config: localOnlyConfig,
    context: mockPanelContext,
    actions: mockPanelActions,
    events: mockPanelEvents,
    placeholder: 'Ask the local AI...',
  },
};

/**
 * Configuration with only the cloud AI provider.
 * Auto-selects cloud since it's the only option.
 */
export const CloudOnly: Story = {
  args: {
    config: cloudOnlyConfig,
    context: mockPanelContext,
    actions: mockPanelActions,
    events: mockPanelEvents,
    placeholder: 'Ask the cloud AI...',
  },
};

/**
 * Shows the panel with pre-loaded conversation.
 */
export const WithExistingConversation: Story = {
  args: {
    config: {
      useCloudProvider: createMockAIProvider({
        initialMessages: [
          {
            id: '1',
            role: 'user',
            content: 'How do I create a React component?',
            timestamp: Date.now() - 60000,
          },
          {
            id: '2',
            role: 'assistant',
            content:
              "Here's how to create a React functional component:\n\n```tsx\nimport React from 'react';\n\ninterface Props {\n  name: string;\n}\n\nexport const MyComponent: React.FC<Props> = ({ name }) => {\n  return <div>Hello, {name}!</div>;\n};\n```\n\nThis creates a typed component with props.",
            timestamp: Date.now() - 30000,
          },
        ],
        responseDelay: 600,
      }),
    },
    context: mockPanelContext,
    actions: mockPanelActions,
    events: mockPanelEvents,
  },
};

/**
 * Custom provider metadata example.
 */
export const CustomProviderMeta: Story = {
  args: {
    config: {
      useLocalProvider: createMockLocalProvider(),
      useCloudProvider: createMockAIProvider(),
      availableModels: MOCK_AVAILABLE_MODELS,
      localProviderMeta: {
        name: 'WebGPU AI',
        description: 'Run advanced models directly in your browser using WebGPU acceleration.',
        badge: 'Beta',
        badgeVariant: 'warning',
        requirements: 'Requires Chrome 113+ with WebGPU enabled',
      },
      cloudProviderMeta: {
        name: 'Claude API',
        description: 'Anthropic Claude - thoughtful AI assistant with strong reasoning.',
        badge: 'Recommended',
        badgeVariant: 'success',
        requirements: 'Requires Anthropic API key',
      },
    },
    context: mockPanelContext,
    actions: mockPanelActions,
    events: mockPanelEvents,
  },
};
