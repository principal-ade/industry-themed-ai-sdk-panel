import React from 'react';
import type { ChatToolbarProps } from '../types';

export const ChatToolbar: React.FC<ChatToolbarProps> = ({ actions = [] }) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="chat-toolbar">
      {actions.map((action) => (
        <button key={action.id} onClick={action.onClick} className="chat-toolbar-button">
          {action.icon && <span>{action.icon}</span>}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
