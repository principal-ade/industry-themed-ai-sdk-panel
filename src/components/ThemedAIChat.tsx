import React, { useEffect } from 'react';
import type { ThemedAIChatProps } from '../types';
import { useThemedAIChat } from '../hooks/useThemedAIChat';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatToolbar } from './ChatToolbar';

/**
 * ThemedAIChat - Main chat component with industry theme integration
 *
 * Integrates Vercel AI SDK with industry theming and provides a complete chat UI.
 * Supports both server-side API and client-side LLM (via customHandler).
 */
export const ThemedAIChat: React.FC<ThemedAIChatProps> = ({
  theme,
  api,
  customHandler,
  initialMessages,
  id,
  placeholder = 'Type a message...',
  containerClassName = '',
  containerStyle,
  hideToolbar = true,
  showLoadingIndicator = true,
  onFinish,
  onError,
}) => {
  const chat = useThemedAIChat({
    theme,
    api,
    customHandler,
    initialMessages,
    id,
    onFinish,
    onError,
  });

  // Apply theme CSS variables to document root for portaled elements
  useEffect(() => {
    const root = document.documentElement;
    const variables = chat.getCSSVariables();

    Object.entries(variables).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, String(value));
      }
    });

    return () => {
      // Cleanup on unmount
      Object.keys(variables).forEach((key) => {
        if (key.startsWith('--')) {
          root.style.removeProperty(key);
        }
      });
    };
  }, [chat]);

  // Determine if we should show a model loading indicator
  const isModelLoading = chat.status === 'loading';

  return (
    <div
      className={`${chat.themeClassName} ${containerClassName}`}
      style={{ ...chat.getCSSVariables(), ...containerStyle }}
    >
      {!hideToolbar && <ChatToolbar theme={theme} />}

      {/* Model loading indicator for custom handlers */}
      {showLoadingIndicator && isModelLoading && (
        <div className="chat-model-loading">
          <div className="chat-model-loading-content">
            <div className="chat-model-loading-spinner" />
            <div className="chat-model-loading-text">
              {chat.loadProgressText || 'Loading model...'}
            </div>
            {typeof chat.loadProgress === 'number' && (
              <div className="chat-model-loading-progress">
                <div
                  className="chat-model-loading-progress-bar"
                  style={{ width: `${Math.round(chat.loadProgress * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <ChatMessageList messages={chat.messages} theme={theme} isLoading={chat.isLoading} />

      {chat.error && (
        <div className="chat-error">
          <strong>Error:</strong> {chat.error.message}
        </div>
      )}

      <ChatInput
        value={chat.input}
        onChange={chat.handleInputChange}
        onSubmit={chat.handleSubmit}
        isLoading={chat.isLoading || isModelLoading}
        placeholder={isModelLoading ? 'Loading model...' : placeholder}
        theme={theme}
      />
    </div>
  );
};
