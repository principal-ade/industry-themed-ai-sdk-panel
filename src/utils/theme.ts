import type { Theme } from '@principal-ade/industry-theme';
import type { CSSProperties } from 'react';

/**
 * Convert industry theme to AI chat CSS variables
 * Maps @a24z/industry-theme to CSS custom properties
 */
export function getAIChatThemeVariables(theme: Theme): CSSProperties {
  return {
    // Layout & Background
    '--ai-chat-bg': theme.colors.background,
    '--ai-chat-fg': theme.colors.text,
    '--ai-chat-border': theme.colors.border,

    // Input
    '--ai-chat-input-bg': theme.colors.backgroundSecondary || theme.colors.background,
    '--ai-chat-input-border': theme.colors.border,
    '--ai-chat-input-focus-border': theme.colors.primary,
    '--ai-chat-input-fg': theme.colors.text,
    '--ai-chat-input-placeholder': theme.colors.textMuted || theme.colors.textSecondary,

    // Buttons
    '--ai-chat-button-bg': theme.colors.primary,
    '--ai-chat-button-fg': theme.colors.background,
    '--ai-chat-button-hover-bg': theme.colors.primary,
    '--ai-chat-button-disabled-bg': theme.colors.muted,
    '--ai-chat-button-disabled-fg': theme.colors.textMuted,

    // Messages
    '--ai-chat-message-user-bg': theme.colors.primary,
    '--ai-chat-message-user-fg': theme.colors.background,
    '--ai-chat-message-assistant-bg': theme.colors.backgroundSecondary,
    '--ai-chat-message-assistant-fg': theme.colors.text,
    '--ai-chat-message-system-bg': theme.colors.accent,
    '--ai-chat-message-system-fg': theme.colors.text,
    '--ai-chat-message-error-bg': theme.colors.error,
    '--ai-chat-message-error-fg': theme.colors.background,

    // Code Blocks
    '--ai-chat-code-bg': theme.colors.backgroundTertiary || theme.colors.backgroundSecondary,
    '--ai-chat-code-fg': theme.colors.text,
    '--ai-chat-code-border': theme.colors.border,

    // Typography
    '--ai-chat-font-family': theme.fonts.body,
    '--ai-chat-font-family-mono': theme.fonts.monospace,
    '--ai-chat-font-size-sm': `${theme.fontSizes[0] || 14}px`,
    '--ai-chat-font-size-base': `${theme.fontSizes[1] || 16}px`,
    '--ai-chat-font-size-lg': `${theme.fontSizes[2] || 18}px`,
    '--ai-chat-line-height': String(theme.lineHeights.body || 1.5),

    // Spacing
    '--ai-chat-spacing-xs': `${theme.space[0] || 4}px`,
    '--ai-chat-spacing-sm': `${theme.space[1] || 8}px`,
    '--ai-chat-spacing-md': `${theme.space[2] || 16}px`,
    '--ai-chat-spacing-lg': `${theme.space[3] || 24}px`,
    '--ai-chat-spacing-xl': `${theme.space[4] || 32}px`,

    // Effects
    '--ai-chat-radius-sm': `${theme.radii[0] || 4}px`,
    '--ai-chat-radius-md': `${theme.radii[1] || 6}px`,
    '--ai-chat-radius-lg': `${theme.radii[2] || 8}px`,
    '--ai-chat-shadow-sm': theme.shadows[0] || '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '--ai-chat-shadow-md': theme.shadows[1] || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    '--ai-chat-shadow-lg': theme.shadows[2] || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

    // Loading/Status
    '--ai-chat-loading-bg': theme.colors.muted,
    '--ai-chat-typing-indicator': theme.colors.primary,
    '--ai-chat-status-success': theme.colors.success,
    '--ai-chat-status-error': theme.colors.error,
    '--ai-chat-status-warning': theme.colors.warning,
  } as CSSProperties;
}
