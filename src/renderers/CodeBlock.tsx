import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-block">
      {language && (
        <div className="code-block-header">
          <span className="code-block-language">{language}</span>
          <button
            onClick={handleCopy}
            className="code-copy-button"
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre>
        <code className={language ? `language-${language}` : ''}>{code}</code>
      </pre>
    </div>
  );
};
