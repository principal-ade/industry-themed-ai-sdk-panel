import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { ThemedAIChat } from './ThemedAIChat';
import type { PanelComponentProps, ThemedAIChatPanelProps } from '../types';

/**
 * ThemedAIChatPanel - Panel-compatible wrapper
 *
 * Implements PanelComponentProps interface for panel framework integration
 */
export const ThemedAIChatPanel: React.FC<PanelComponentProps & ThemedAIChatPanelProps> = ({
  context,
  actions,
  events,
  ...chatProps
}) => {
  const { theme } = useTheme();

  // Emit panel events for chat actions
  const handleFinish = (message: any) => {
    events.emit({
      type: 'ai-chat:message-received',
      source: 'principal-ade.ai-chat',
      timestamp: Date.now(),
      payload: { message },
    });

    chatProps.onFinish?.(message);
  };

  const handleError = (error: Error) => {
    events.emit({
      type: 'ai-chat:error',
      source: 'principal-ade.ai-chat',
      timestamp: Date.now(),
      payload: { error: error.message },
    });

    chatProps.onError?.(error);
  };

  return (
    <ThemedAIChat
      theme={theme}
      {...chatProps}
      onFinish={handleFinish}
      onError={handleError}
    />
  );
};
