import React, { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ChatMessageListProps } from '../types';
import { ChatMessage } from './ChatMessage';

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, theme, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
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

  // Check if the last message is an assistant message (streaming in progress)
  const lastMessage = messages[messages.length - 1];
  const isStreamingAssistant = lastMessage?.role === 'assistant';

  // Only show loading indicator if loading AND no assistant message is streaming yet
  const showLoadingIndicator = isLoading && !isStreamingAssistant;

  return (
    <div className="chat-message-list">
      {messages.map((message, index) => (
        <ChatMessage key={message.id || index} message={message} theme={theme} />
      ))}
      {showLoadingIndicator && (
        <div className="chat-message" data-role="assistant">
          <div className="message-header">
            <span className="message-role">assistant</span>
          </div>
          <div className="message-content">
            <div className="chat-loading">
              <div className="chat-loading-dot" />
              <div className="chat-loading-dot" />
              <div className="chat-loading-dot" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
