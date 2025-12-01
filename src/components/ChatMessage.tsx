import React from 'react';
import type { ChatMessageProps } from '../types';
import { MarkdownRenderer } from '../renderers/MarkdownRenderer';

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, theme }) => {
  const formatTimestamp = (createdAt?: Date) => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-message" data-role={message.role}>
      <div className="message-header">
        <span className="message-role">{message.role}</span>
        {message.createdAt && (
          <span className="message-timestamp">{formatTimestamp(message.createdAt)}</span>
        )}
      </div>
      <div className="message-content">
        <MarkdownRenderer message={message} theme={theme} />
      </div>
    </div>
  );
};
