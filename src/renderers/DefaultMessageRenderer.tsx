import React from 'react';
import type { MessageRendererProps } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

export const DefaultMessageRenderer: React.FC<MessageRendererProps> = ({ message, theme }) => {
  const formatTimestamp = (createdAt?: Date) => {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message message-${message.role}`}>
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
