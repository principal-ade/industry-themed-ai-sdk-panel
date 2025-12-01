import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { MessageRendererProps } from '../types';
import { CodeBlock } from './CodeBlock';

export const MarkdownRenderer: React.FC<MessageRendererProps> = ({ message }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : undefined;
            const code = String(children).replace(/\n$/, '');
            const isInline = !className || !language;

            if (!isInline && language) {
              return <CodeBlock code={code} language={language} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};
