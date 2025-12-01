/**
 * Panel Extension Entry Point
 *
 * This file exports the panel definitions array for the Panel Extension Store V2 specification.
 * @see https://github.com/principal-ade/panel-framework/PANEL_EXTENSION_STORE_SPECIFICATION_V2.md
 *
 * USAGE:
 * This panel requires configuration from the host application. The host should create
 * a configured wrapper component:
 *
 * ```tsx
 * import { AIChatPanel, AIChatPanelConfig } from '@principal-ade/industry-themed-ai-sdk-panel';
 *
 * const config: AIChatPanelConfig = {
 *   useLocalProvider: () => useWebLLM(),  // Your local AI hook
 *   useCloudProvider: () => useGemini(),  // Your cloud AI hook
 *   availableModels: AVAILABLE_MODELS,
 * };
 *
 * const ConfiguredAIChatPanel = (props: PanelComponentProps) => (
 *   <AIChatPanel {...props} config={config} />
 * );
 * ```
 */

import { ThemedAIChatPanel } from './components/ThemedAIChatPanel';
import type { PanelDefinition, PanelContextValue } from './types';

// Re-export components for host configuration
export { AIChatPanel } from './components/AIChatPanel';
export { ThemedAIChat } from './components/ThemedAIChat';
export { ThemedAIChatPanel } from './components/ThemedAIChatPanel';

// Re-export types
export type {
  AIChatPanelConfig,
  AIChatPanelProps,
  AIProviderHook,
  AIProviderType,
  AIProviderMeta,
  AIModelDefinition,
  CustomChatHandler,
  CustomChatMessage,
  PanelComponentProps,
  PanelContextValue,
  PanelActions,
  PanelEventEmitter,
  PanelDefinition,
} from './types';

/**
 * Panel Definitions
 *
 * Array of panel definitions that this package provides.
 * Each panel can be discovered and loaded by the host application.
 *
 * NOTE: The default component (ThemedAIChatPanel) is a simple wrapper that expects
 * a customHandler prop. For the full provider selection UI, use AIChatPanel with config.
 */
export const panels: PanelDefinition[] = [
  {
    id: 'principal-ade.ai-chat',
    name: 'AI Chat Panel',
    icon: '🤖',
    version: '0.2.0',
    author: 'Principal ADE Team',
    description: 'Industry-themed AI chat interface with configurable AI providers',
    component: ThemedAIChatPanel,

    /**
     * Called when the panel is mounted
     */
    onMount: async (context: PanelContextValue) => {
      console.log('AI Chat Panel mounted', {
        repository: context.currentScope.repository?.path,
        hasGitData: context.hasSlice('git', 'repository'),
      });

      // Refresh context data if needed
      if (context.hasSlice('git', 'repository') && !context.isSliceLoading('git', 'repository')) {
        const gitSlice = context.getRepositorySlice('git');
        if (gitSlice && gitSlice.data) {
          // Git data available for context enrichment
        }
      }
    },

    /**
     * Called when the panel is unmounted
     */
    onUnmount: async (_context: PanelContextValue) => {
      console.log('AI Chat Panel unmounting');
    },
  },
];

/**
 * Package-level lifecycle hooks
 */

export const onPackageLoad = async () => {
  console.log('@principal-ade/industry-themed-ai-sdk-panel loaded');
};

export const onPackageUnload = async (): Promise<void> => {
  console.log('@principal-ade/industry-themed-ai-sdk-panel unloading');
};
