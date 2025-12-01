import type { Meta, StoryObj } from '@storybook/react';
import { useTheme } from '@principal-ade/industry-theme';
import { ThemedAIChat } from '../components/ThemedAIChat';
import type { CustomChatHandler, CustomChatMessage } from '../types';
import { createMockAIProvider, ThemeDecorator } from './mocks';
import { useState, useCallback } from 'react';

// Wrapper to provide theme
const ThemedAIChatWithTheme = (
  props: Omit<React.ComponentProps<typeof ThemedAIChat>, 'theme'>
) => {
  const { theme } = useTheme();
  return <ThemedAIChat {...props} theme={theme} />;
};

const meta: Meta<typeof ThemedAIChatWithTheme> = {
  title: 'Components/ThemedAIChat',
  component: ThemedAIChatWithTheme,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The core chat component with industry theme integration.

This is the lower-level component that handles the actual chat UI.
Use \`AIChatPanel\` for the full panel experience with provider selection.

## Features
- Industry theme CSS variable integration
- Support for both API-based and custom chat handlers
- Message list with user/assistant styling
- Input with loading states
- Error handling display
- Model loading progress indicator
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemedAIChatWithTheme>;

/**
 * Basic chat with a mock custom handler.
 */
export const Default: Story = {
  render: () => {
    const useMockProvider = createMockAIProvider();
    const MockChat = () => {
      const handler = useMockProvider();
      const { theme } = useTheme();
      return (
        <ThemedAIChat
          theme={theme}
          customHandler={handler}
          placeholder="Type a message..."
        />
      );
    };
    return <MockChat />;
  },
};

/**
 * Chat with pre-existing messages.
 */
export const WithMessages: Story = {
  render: () => {
    const useMockProvider = createMockAIProvider({
      initialMessages: [
        {
          id: '1',
          role: 'user',
          content: 'What is TypeScript?',
        },
        {
          id: '2',
          role: 'assistant',
          content:
            'TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing, classes, and interfaces, making it easier to develop large-scale applications.\n\nKey features:\n- Static type checking\n- IDE support with autocompletion\n- Modern JavaScript features\n- Gradual adoption possible',
        },
        {
          id: '3',
          role: 'user',
          content: 'Show me an example',
        },
        {
          id: '4',
          role: 'assistant',
          content:
            "Here's a simple TypeScript example:\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction greetUser(user: User): string {\n  return `Hello, ${user.name}!`;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'Alice',\n  email: 'alice@example.com'\n};\n\nconsole.log(greetUser(user));\n```",
        },
      ],
    });
    const MockChat = () => {
      const handler = useMockProvider();
      const { theme } = useTheme();
      return (
        <ThemedAIChat
          theme={theme}
          customHandler={handler}
          placeholder="Continue the conversation..."
        />
      );
    };
    return <MockChat />;
  },
};

/**
 * Shows the loading state when a model is being loaded.
 */
export const ModelLoading: Story = {
  render: () => {
    const { theme } = useTheme();
    const loadingHandler: CustomChatHandler = {
      messages: [],
      isGenerating: false,
      sendMessage: async () => {},
      clearMessages: () => {},
      stopGeneration: () => {},
      status: 'loading',
      loadProgress: 0.45,
      loadProgressText: 'Loading Llama 3.2 3B... 45%',
    };
    return (
      <ThemedAIChat
        theme={theme}
        customHandler={loadingHandler}
        showLoadingIndicator={true}
      />
    );
  },
};

/**
 * Shows the generating state while AI is responding.
 */
export const Generating: Story = {
  render: () => {
    const { theme } = useTheme();
    const generatingHandler: CustomChatHandler = {
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Explain quantum computing in simple terms',
        },
      ],
      isGenerating: true,
      sendMessage: async () => {},
      clearMessages: () => {},
      stopGeneration: () => {},
      status: 'generating',
    };
    return <ThemedAIChat theme={theme} customHandler={generatingHandler} />;
  },
};

/**
 * Shows error state display.
 */
export const WithError: Story = {
  render: () => {
    const { theme } = useTheme();
    const errorHandler: CustomChatHandler = {
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Generate something complex',
        },
      ],
      isGenerating: false,
      sendMessage: async () => {},
      clearMessages: () => {},
      stopGeneration: () => {},
      status: 'error',
      error: new Error('Model ran out of memory. Try a smaller model or clear the context.'),
    };
    return <ThemedAIChat theme={theme} customHandler={errorHandler} />;
  },
};

/**
 * Interactive demo with full functionality.
 */
export const Interactive: Story = {
  render: () => {
    const InteractiveChat = () => {
      const { theme } = useTheme();
      const [messages, setMessages] = useState<CustomChatMessage[]>([]);
      const [isGenerating, setIsGenerating] = useState(false);

      const sendMessage = useCallback(async (content: string) => {
        const userMsg: CustomChatMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsGenerating(true);

        // Simulate typing delay
        await new Promise((r) => setTimeout(r, 1500));

        const responses = [
          "I understand you're asking about that. Let me help!",
          "That's a great question. Here's what I think...",
          "Based on the context, I would suggest the following approach.",
        ];

        const assistantMsg: CustomChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: responses[Math.floor(Math.random() * responses.length)],
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsGenerating(false);
      }, []);

      const handler: CustomChatHandler = {
        messages,
        isGenerating,
        sendMessage,
        clearMessages: () => setMessages([]),
        stopGeneration: () => setIsGenerating(false),
        status: isGenerating ? 'generating' : 'ready',
      };

      return (
        <ThemedAIChat
          theme={theme}
          customHandler={handler}
          placeholder="Try typing a message..."
          onFinish={(msg) => console.log('Message finished:', msg)}
          onError={(err) => console.error('Error:', err)}
        />
      );
    };
    return <InteractiveChat />;
  },
};
