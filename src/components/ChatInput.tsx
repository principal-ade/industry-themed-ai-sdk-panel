import React from 'react';
import type { ChatInputProps } from '../types';

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Type a message...',
}) => {
  return (
    <div className="chat-input-container">
      <form className="chat-input-form" onSubmit={onSubmit}>
        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={isLoading}
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="chat-submit-button"
          disabled={isLoading || !value.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
