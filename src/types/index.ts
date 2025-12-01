/**
 * Type definitions for @principal-ade/industry-themed-ai-sdk
 */

import type { Message } from 'ai';
import type { Theme } from '@principal-ade/industry-theme';
import type { CSSProperties, ReactNode, ChangeEvent, FormEvent } from 'react';

// AI SDK re-exports
export type { Message } from 'ai';

// Theme types
export interface AIChatThemeVariables extends CSSProperties {
  '--ai-chat-bg'?: string;
  '--ai-chat-fg'?: string;
  '--ai-chat-border'?: string;
  '--ai-chat-input-bg'?: string;
  '--ai-chat-input-border'?: string;
  '--ai-chat-button-bg'?: string;
  // ... more will be added
}

// Component props
export interface ThemedAIChatProps {
  theme: Theme;
  api?: string | ((request: Request) => Response | Promise<Response>);
  /** Custom chat handler for client-side LLMs (takes precedence over api) */
  customHandler?: CustomChatHandler;
  initialMessages?: Message[];
  id?: string;
  placeholder?: string;
  submitButtonLabel?: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  hideToolbar?: boolean;
  hideTimestamps?: boolean;
  /** Show loading indicator when model is loading */
  showLoadingIndicator?: boolean;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export interface ThemedAIChatPanelProps extends Omit<ThemedAIChatProps, 'theme'> {
  // Panel props will be added
}

export interface ThemedAIChatPanelWithProviderProps extends ThemedAIChatPanelProps {
  themeName?: string;
}

export interface ChatMessageListProps {
  messages: Message[];
  theme: Theme;
}

export interface ChatMessageProps {
  message: Message;
  theme: Theme;
}

export interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  placeholder?: string;
  theme: Theme;
}

export interface ChatToolbarProps {
  actions?: ToolbarAction[];
  theme: Theme;
}

/** Message type for custom chat handlers (more flexible than AI SDK Message) */
export interface CustomChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

// Custom chat handler interface for client-side LLMs (e.g., WebLLM)
export interface CustomChatHandler {
  /** Current messages in the chat */
  messages: CustomChatMessage[];
  /** Whether the model is currently generating */
  isGenerating: boolean;
  /** Send a message and get a streaming response */
  sendMessage: (content: string) => Promise<void>;
  /** Clear all messages */
  clearMessages: () => void;
  /** Stop the current generation */
  stopGeneration: () => void;
  /** Optional: Current status of the handler */
  status?: 'idle' | 'loading' | 'ready' | 'error' | 'generating';
  /** Optional: Loading progress (0-1) */
  loadProgress?: number;
  /** Optional: Loading progress text */
  loadProgressText?: string;
  /** Optional: Error if any */
  error?: Error | null;
}

/**
 * AI Provider Hook Interface
 *
 * This interface defines the contract that host applications must implement
 * for their AI provider hooks (e.g., WebLLM, Gemini, OpenAI).
 *
 * The panel library defines this interface, and the host application
 * provides implementations via AIChatPanelConfig.
 */
export interface AIProviderHook extends CustomChatHandler {
  /** Load a specific model (for local providers) */
  loadModel?: (modelId: string) => Promise<void>;
}

/** Model definition for local AI providers */
export interface AIModelDefinition {
  id: string;
  name: string;
  size: string;
  description?: string;
}

/** Provider type identifier */
export type AIProviderType = 'local' | 'cloud';

/** Provider metadata for display */
export interface AIProviderMeta {
  type: AIProviderType;
  name: string;
  description: string;
  badge?: string;
  badgeVariant?: 'success' | 'info' | 'warning';
  requirements?: string;
}

/**
 * AI Chat Panel Configuration
 *
 * Host applications pass this config to provide their AI provider implementations.
 * The panel handles the UI and provider selection logic.
 */
export interface AIChatPanelConfig {
  /** Hook for local/browser-based AI provider (e.g., WebLLM) */
  useLocalProvider?: () => AIProviderHook;
  /** Hook for cloud-based AI provider (e.g., Gemini, OpenAI) */
  useCloudProvider?: () => AIProviderHook;
  /** Available models for local provider */
  availableModels?: AIModelDefinition[];
  /** Custom metadata for local provider */
  localProviderMeta?: Partial<AIProviderMeta>;
  /** Custom metadata for cloud provider */
  cloudProviderMeta?: Partial<AIProviderMeta>;
}

/** Props for the AIChatPanel component */
export interface AIChatPanelProps extends PanelComponentProps {
  /** Provider configuration from host application */
  config: AIChatPanelConfig;
  /** Placeholder text for the chat input */
  placeholder?: string;
}

// Hook types
export interface UseThemedAIChatOptions {
  theme?: Theme;
  api?: string | ((request: Request) => Response | Promise<Response>);
  /** Custom chat handler for client-side LLMs (takes precedence over api) */
  customHandler?: CustomChatHandler;
  initialMessages?: Message[];
  id?: string;
  onFinish?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export interface UseThemedAIChatReturn {
  messages: Message[];
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  error: Error | undefined;
  reload: () => void;
  stop: () => void;
  getCSSVariables: () => CSSProperties;
  themeClassName: string;
  /** Status from custom handler if available */
  status?: 'idle' | 'loading' | 'ready' | 'error' | 'generating';
  /** Loading progress from custom handler if available */
  loadProgress?: number;
  /** Loading progress text from custom handler if available */
  loadProgressText?: string;
}

export interface UsePanelAIChatOptions extends UseThemedAIChatOptions {
  enrichWithContext?: boolean;
}

// Renderer types
export interface MessageRendererProps {
  message: Message;
  theme: Theme;
}

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

// Panel Framework V2 Specification Types

export type PanelEventType =
  | 'file:opened'
  | 'file:saved'
  | 'file:deleted'
  | 'git:status-changed'
  | 'git:commit'
  | 'git:branch-changed'
  | 'panel:focus'
  | 'panel:blur'
  | 'data:refresh'
  | 'ai-chat:message-sent'
  | 'ai-chat:message-received'
  | 'ai-chat:error'
  | string; // Custom events allowed

export interface PanelEvent<T = unknown> {
  type: PanelEventType;
  source: string;
  timestamp: number;
  payload: T; // Required in v0.1.1
}

export interface WorkspaceMetadata {
  path: string;
  name: string;
  // Add more fields as needed
}

export interface RepositoryMetadata {
  path: string;
  name: string;
  // Add more fields as needed
}

export interface DataSlice<T = unknown> {
  scope: 'workspace' | 'repository' | 'global';
  name: string;
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface GitStatus {
  staged: string[];
  unstaged: string[];
  untracked: string[];
  deleted: string[];
}

export interface MarkdownFile {
  path: string;
  content: string;
}

export interface FileTree {
  // Define file tree structure
  [key: string]: unknown;
}

export interface PackageLayer {
  // Define package layer structure
  [key: string]: unknown;
}

export interface QualityMetrics {
  // Define quality metrics structure
  [key: string]: unknown;
}

export interface PanelContextValue {
  currentScope: {
    type: 'workspace' | 'repository';
    workspace?: WorkspaceMetadata;
    repository?: RepositoryMetadata;
  };
  slices: ReadonlyMap<string, DataSlice>;
  getSlice<T>(name: string): DataSlice<T> | undefined;
  getWorkspaceSlice<T>(name: string): DataSlice<T> | undefined;
  getRepositorySlice<T>(name: string): DataSlice<T> | undefined;
  hasSlice(name: string, scope?: 'workspace' | 'repository'): boolean;
  isSliceLoading(name: string, scope?: 'workspace' | 'repository'): boolean;
  refresh(scope?: 'workspace' | 'repository', slice?: string): Promise<void>;
}

export interface PanelActions {
  openFile?: (filePath: string) => void;
  openGitDiff?: (filePath: string, status?: string) => void;
  navigateToPanel?: (panelId: string) => void;
  notifyPanels?: (event: PanelEvent) => void;
}

export interface PanelEventEmitter {
  emit<T>(event: PanelEvent<T>): void;
  on<T>(type: PanelEventType, handler: (event: PanelEvent<T>) => void): () => void;
  off<T>(type: PanelEventType, handler: (event: PanelEvent<T>) => void): void;
}

export interface PanelComponentProps {
  /** Access to shared data and state */
  context: PanelContextValue;

  /** Actions for interpanel communication */
  actions: PanelActions;

  /** Event system for panel-to-panel communication */
  events: PanelEventEmitter;
}

export interface PanelDefinition {
  // Metadata
  id: string;
  name: string;
  icon?: string;
  version?: string;
  author?: string;
  description?: string;

  // Component
  component: React.ComponentType<PanelComponentProps>;

  // Optional per-panel lifecycle hooks
  onMount?: (context: PanelContextValue) => void | Promise<void>;
  onUnmount?: (context: PanelContextValue) => void | Promise<void>;
}
