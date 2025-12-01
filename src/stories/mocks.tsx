/**
 * Mock providers and utilities for Storybook testing
 */

import React, { useState, useCallback } from 'react';
import type {
  AIProviderHook,
  AIModelDefinition,
  CustomChatMessage,
  PanelContextValue,
  PanelActions,
  PanelEventEmitter,
  PanelEvent,
} from '../types';

/**
 * Mock AI Provider Hook
 *
 * Creates a mock AI provider for testing purposes.
 * Simulates message sending with configurable delay and responses.
 */
export function createMockAIProvider(options?: {
  initialMessages?: CustomChatMessage[];
  responseDelay?: number;
  mockResponses?: string[];
}): () => AIProviderHook {
  const {
    initialMessages = [],
    responseDelay = 1000,
    mockResponses = [
      "Hello! I'm a mock AI assistant. How can I help you today?",
      "That's an interesting question. Let me think about that...",
      "Based on the code context, I would suggest checking the component props.",
      "Here's an example:\n```typescript\nconst example = () => {\n  return 'Hello World';\n};\n```",
    ],
  } = options || {};

  let responseIndex = 0;

  return function useMockProvider(): AIProviderHook {
    const [messages, setMessages] = useState<CustomChatMessage[]>(initialMessages);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<AIProviderHook['status']>('ready');
    const [error, setError] = useState<Error | null>(null);

    const sendMessage = useCallback(
      async (content: string) => {
        // Add user message
        const userMessage: CustomChatMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsGenerating(true);
        setStatus('generating');

        // Simulate AI response delay
        await new Promise((resolve) => setTimeout(resolve, responseDelay));

        // Add assistant response
        const assistantMessage: CustomChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: mockResponses[responseIndex % mockResponses.length],
          timestamp: Date.now(),
        };
        responseIndex++;

        setMessages((prev) => [...prev, assistantMessage]);
        setIsGenerating(false);
        setStatus('ready');
      },
      [responseDelay, mockResponses]
    );

    const clearMessages = useCallback(() => {
      setMessages([]);
    }, []);

    const stopGeneration = useCallback(() => {
      setIsGenerating(false);
      setStatus('ready');
    }, []);

    return {
      messages,
      isGenerating,
      sendMessage,
      clearMessages,
      stopGeneration,
      status,
      error,
    };
  };
}

/**
 * Mock Local Provider with model loading simulation
 */
export function createMockLocalProvider(): () => AIProviderHook {
  return function useMockLocalProvider(): AIProviderHook {
    const [messages, setMessages] = useState<CustomChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<AIProviderHook['status']>('idle');
    const [loadProgress, setLoadProgress] = useState<number | undefined>(undefined);
    const [loadProgressText, setLoadProgressText] = useState<string | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    const loadModel = useCallback(async (modelId: string) => {
      setStatus('loading');
      setLoadProgressText(`Loading ${modelId}...`);

      // Simulate loading progress
      for (let i = 0; i <= 100; i += 10) {
        setLoadProgress(i / 100);
        setLoadProgressText(`Loading ${modelId}... ${i}%`);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setStatus('ready');
      setLoadProgress(undefined);
      setLoadProgressText(undefined);
    }, []);

    const sendMessage = useCallback(async (content: string) => {
      const userMessage: CustomChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsGenerating(true);
      setStatus('generating');

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: CustomChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `[Local Model Response]\n\nYou said: "${content}"\n\nThis is a simulated response from the local browser-based model.`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
      setStatus('ready');
    }, []);

    const clearMessages = useCallback(() => {
      setMessages([]);
    }, []);

    const stopGeneration = useCallback(() => {
      setIsGenerating(false);
      setStatus('ready');
    }, []);

    return {
      messages,
      isGenerating,
      sendMessage,
      clearMessages,
      stopGeneration,
      status,
      loadProgress,
      loadProgressText,
      error,
      loadModel,
    };
  };
}

/**
 * Mock available models for local provider
 */
export const MOCK_AVAILABLE_MODELS: AIModelDefinition[] = [
  {
    id: 'llama-3.2-1b',
    name: 'Llama 3.2 1B',
    size: '1.2 GB',
    description: 'Fast, lightweight model for simple tasks',
  },
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 3B',
    size: '3.4 GB',
    description: 'Balanced model for general use',
  },
  {
    id: 'qwen-2.5-coder-1.5b',
    name: 'Qwen 2.5 Coder 1.5B',
    size: '1.8 GB',
    description: 'Specialized for code generation',
  },
];

/**
 * Mock Panel Context
 */
export const mockPanelContext: PanelContextValue = {
  currentScope: {
    type: 'repository',
    repository: {
      path: '/mock/repository',
      name: 'mock-repo',
    },
  },
  slices: new Map(),
  getSlice: () => undefined,
  getWorkspaceSlice: () => undefined,
  getRepositorySlice: () => undefined,
  hasSlice: () => false,
  isSliceLoading: () => false,
  refresh: async () => {},
};

/**
 * Mock Panel Actions
 */
export const mockPanelActions: PanelActions = {
  openFile: (path) => console.log('Open file:', path),
  openGitDiff: (path) => console.log('Open git diff:', path),
  navigateToPanel: (id) => console.log('Navigate to panel:', id),
  notifyPanels: (event) => console.log('Notify panels:', event),
};

/**
 * Mock Panel Event Emitter
 */
export const mockPanelEvents: PanelEventEmitter = {
  emit: <T,>(event: PanelEvent<T>) => console.log('Event emitted:', event),
  on: <T,>(_type: string, _handler: (event: PanelEvent<T>) => void) => () => {},
  off: <T,>(_type: string, _handler: (event: PanelEvent<T>) => void) => {},
};

/**
 * Theme Provider Decorator for Storybook
 */
import { ThemeProvider } from '@principal-ade/industry-theme';

export const ThemeDecorator = (Story: React.ComponentType) => (
  <ThemeProvider>
    <div
      style={{
        height: '500px',
        width: '400px',
        border: '1px solid #333',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Story />
    </div>
  </ThemeProvider>
);
