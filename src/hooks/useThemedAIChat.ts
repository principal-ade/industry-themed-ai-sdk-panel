import { useChat } from 'ai/react';
import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import type { Message } from 'ai';
import type { UseThemedAIChatOptions, UseThemedAIChatReturn } from '../types';
import { getAIChatThemeVariables } from '../utils/theme';

export function useThemedAIChat(options: UseThemedAIChatOptions): UseThemedAIChatReturn {
  // If a custom handler is provided, use it instead of useChat
  if (options.customHandler) {
    return useCustomHandlerChat(options);
  }

  // Default behavior: use Vercel AI SDK's useChat
  const chat = useChat({
    api: typeof options.api === 'string' ? options.api : undefined,
    initialMessages: options.initialMessages,
    id: options.id,
    onFinish: options.onFinish,
    onError: options.onError,
  });

  return {
    messages: chat.messages,
    input: chat.input,
    handleInputChange: chat.handleInputChange,
    handleSubmit: chat.handleSubmit,
    isLoading: chat.isLoading,
    error: chat.error,
    reload: chat.reload,
    stop: chat.stop,
    getCSSVariables: () => (options.theme ? getAIChatThemeVariables(options.theme) : {}),
    themeClassName: 'themed-ai-chat',
  };
}

/**
 * Internal hook for using a custom chat handler (e.g., WebLLM)
 */
function useCustomHandlerChat(options: UseThemedAIChatOptions): UseThemedAIChatReturn {
  const { customHandler } = options;
  const [input, setInput] = useState('');

  // Convert custom handler messages to AI SDK Message format
  const messages: Message[] = (customHandler?.messages || []).map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp || Date.now()),
  }));

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !customHandler) return;

      const messageContent = input;
      setInput('');

      try {
        await customHandler.sendMessage(messageContent);

        // Call onFinish with the last assistant message
        const lastMessage = customHandler.messages[customHandler.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && options.onFinish) {
          options.onFinish({
            id: lastMessage.id,
            role: 'assistant',
            content: lastMessage.content,
          });
        }
      } catch (err) {
        if (options.onError && err instanceof Error) {
          options.onError(err);
        }
      }
    },
    [input, customHandler, options]
  );

  const reload = useCallback(() => {
    // For custom handlers, we could potentially re-send the last user message
    // For now, this is a no-op
    console.warn('reload() is not supported with custom handlers');
  }, []);

  const stop = useCallback(() => {
    customHandler?.stopGeneration();
  }, [customHandler]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: customHandler?.isGenerating || false,
    error: customHandler?.error || undefined,
    reload,
    stop,
    getCSSVariables: () => (options.theme ? getAIChatThemeVariables(options.theme) : {}),
    themeClassName: 'themed-ai-chat',
    // Custom handler specific fields
    status: customHandler?.status,
    loadProgress: customHandler?.loadProgress,
    loadProgressText: customHandler?.loadProgressText,
  };
}
