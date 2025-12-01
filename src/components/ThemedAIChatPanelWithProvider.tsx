import React from 'react';
import { ThemeProvider } from '@principal-ade/industry-theme';
import { ThemedAIChatPanel } from './ThemedAIChatPanel';
import type { PanelComponentProps, ThemedAIChatPanelWithProviderProps } from '../types';

/**
 * ThemedAIChatPanelWithProvider - Includes theme provider wrapper
 */
export const ThemedAIChatPanelWithProvider: React.FC<
  PanelComponentProps & ThemedAIChatPanelWithProviderProps
> = ({ ...props }) => {
  return (
    <ThemeProvider>
      <ThemedAIChatPanel {...props} />
    </ThemeProvider>
  );
};
