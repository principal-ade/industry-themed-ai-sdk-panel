import React, { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ChatMessageListProps } from '../types';
import { ChatMessage } from './ChatMessage';

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, theme }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="chat-message-list">
        <div className="chat-empty-state">
          <div className="chat-empty-state-icon">
            <MessageSquare size={48} strokeWidth={1.5} />
          </div>
          <div className="chat-empty-state-text">No messages yet</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            Start a conversation by typing a message below
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message-list">
      {messages.map((message, index) => (
        <ChatMessage key={message.id || index} message={message} theme={theme} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
