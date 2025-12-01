'use client';

/**
 * AI Chat Panel with Provider Selection
 *
 * A configurable AI chat panel that supports multiple providers.
 * Host applications provide their provider implementations via config.
 */

import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { ThemedAIChat } from './ThemedAIChat';
import type {
  AIChatPanelProps,
  AIProviderType,
  AIModelDefinition,
  CustomChatHandler,
} from '../types';

// Icons (inline SVG to avoid external dependencies)
const CpuIcon = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const CloudIcon = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={style}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const ChevronLeftIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const PlusIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const STORAGE_KEY_PROVIDER = 'ai-chat-provider';
const STORAGE_KEY_MODEL = 'ai-chat-local-model';

// Default provider metadata
const DEFAULT_LOCAL_META = {
  name: 'Local (Browser)',
  description: 'Run AI models directly in your browser using WebGPU. No data leaves your device.',
  badge: 'Free',
  badgeVariant: 'success' as const,
  requirements: 'Requires WebGPU support (Chrome/Edge recommended)',
};

const DEFAULT_CLOUD_META = {
  name: 'Cloud AI',
  description: 'Fast, capable cloud model. Best for complex queries.',
  badge: 'Cloud',
  badgeVariant: 'info' as const,
  requirements: 'Requires API key configuration',
};

// Reusable styles
const styles = {
  fullContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  fullContainerColumn: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  } as React.CSSProperties,
  contentWrapper: {
    maxWidth: '28rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  } as React.CSSProperties,
  textCenter: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,
  heading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    margin: 0,
  } as React.CSSProperties,
  subtext: {
    fontSize: '0.875rem',
    margin: 0,
  } as React.CSSProperties,
  smallText: {
    fontSize: '0.75rem',
    marginTop: '8px',
  } as React.CSSProperties,
  buttonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  } as React.CSSProperties,
  providerButton: {
    width: '100%',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  } as React.CSSProperties,
  providerButtonContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  } as React.CSSProperties,
  iconWrapper: {
    padding: '8px',
    borderRadius: '6px',
  } as React.CSSProperties,
  flexOne: {
    flex: 1,
  } as React.CSSProperties,
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  badge: {
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '4px',
  } as React.CSSProperties,
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '16px',
    fontSize: '0.875rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  } as React.CSSProperties,
  modelButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  } as React.CSSProperties,
  modelButtonContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  } as React.CSSProperties,
  headerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.875rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  } as React.CSSProperties,
  chatContainer: {
    flex: 1,
    minHeight: 0,
  } as React.CSSProperties,
};

export function AIChatPanel({
  config,
  events,
  placeholder = 'Ask me anything about your code...',
}: AIChatPanelProps) {
  const { theme } = useTheme();

  const [selectedProvider, setSelectedProvider] = useState<AIProviderType | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Get provider hooks (only call if provider function exists)
  const localProvider = config.useLocalProvider?.();
  const cloudProvider = config.useCloudProvider?.();

  // Merge default metadata with custom
  const localMeta = { ...DEFAULT_LOCAL_META, ...config.localProviderMeta };
  const cloudMeta = { ...DEFAULT_CLOUD_META, ...config.cloudProviderMeta };

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedProvider = localStorage.getItem(STORAGE_KEY_PROVIDER) as AIProviderType | null;
    const savedModel = localStorage.getItem(STORAGE_KEY_MODEL);

    if (savedProvider === 'cloud' && config.useCloudProvider) {
      setSelectedProvider('cloud');
    } else if (savedProvider === 'local' && savedModel && config.useLocalProvider) {
      setSelectedProvider('local');
      setSelectedModelId(savedModel);
      localProvider?.loadModel?.(savedModel);
    }

    setInitialized(true);
  }, []);

  // Save provider preference when it changes
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;

    if (selectedProvider) {
      localStorage.setItem(STORAGE_KEY_PROVIDER, selectedProvider);
    } else {
      localStorage.removeItem(STORAGE_KEY_PROVIDER);
    }
  }, [selectedProvider, initialized]);

  // Save model preference when it changes
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;

    if (selectedModelId) {
      localStorage.setItem(STORAGE_KEY_MODEL, selectedModelId);
    } else {
      localStorage.removeItem(STORAGE_KEY_MODEL);
    }
  }, [selectedModelId, initialized]);

  // Create custom handler based on selected provider
  const customHandler: CustomChatHandler | null = useMemo(() => {
    if (selectedProvider === 'local' && localProvider && localProvider.status !== 'idle') {
      return {
        messages: localProvider.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
        isGenerating: localProvider.isGenerating,
        sendMessage: localProvider.sendMessage,
        clearMessages: localProvider.clearMessages,
        stopGeneration: localProvider.stopGeneration,
        status: localProvider.status,
        loadProgress: localProvider.loadProgress,
        loadProgressText: localProvider.loadProgressText,
        error: localProvider.error,
      };
    }

    if (selectedProvider === 'cloud' && cloudProvider) {
      return {
        messages: cloudProvider.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
        isGenerating: cloudProvider.isGenerating,
        sendMessage: cloudProvider.sendMessage,
        clearMessages: cloudProvider.clearMessages,
        stopGeneration: cloudProvider.stopGeneration,
        status: cloudProvider.status,
        error: cloudProvider.error,
      };
    }

    return null;
  }, [selectedProvider, localProvider, cloudProvider]);

  // Emit panel events for chat actions
  const handleFinish = (message: { role: string; content: string }) => {
    events.emit({
      type: 'ai-chat:message-received',
      source: `${selectedProvider}.ai-chat`,
      timestamp: Date.now(),
      payload: { message },
    });
  };

  const handleError = (error: Error) => {
    events.emit({
      type: 'ai-chat:error',
      source: `${selectedProvider}.ai-chat`,
      timestamp: Date.now(),
      payload: { error: error.message },
    });
  };

  // Handle local model selection
  const handleLocalModelSelect = async (modelId: string) => {
    setSelectedModelId(modelId);
    await localProvider?.loadModel?.(modelId);
  };

  // Handle back button
  const handleBack = () => {
    if (selectedProvider === 'local' && localProvider?.status === 'idle') {
      setSelectedProvider(null);
    } else if (selectedProvider === 'cloud') {
      setSelectedProvider(null);
    } else {
      setSelectedProvider(null);
      setSelectedModelId(null);
    }
  };

  // Show loading while initializing from localStorage
  if (!initialized) {
    return (
      <div
        style={{
          ...styles.fullContainer,
          background: theme.colors.background,
          color: theme.colors.textMuted,
        }}
      >
        Loading...
      </div>
    );
  }

  // Provider selection screen
  if (!selectedProvider) {
    const hasLocal = !!config.useLocalProvider;
    const hasCloud = !!config.useCloudProvider;

    // If only one provider, auto-select it
    if (hasLocal && !hasCloud) {
      setSelectedProvider('local');
      return null;
    }
    if (hasCloud && !hasLocal) {
      setSelectedProvider('cloud');
      return null;
    }

    return (
      <div
        style={{
          ...styles.fullContainerColumn,
          background: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
        }}
      >
        <div style={styles.contentWrapper}>
          <div style={styles.textCenter as React.CSSProperties}>
            <h3 style={{ ...styles.heading, color: theme.colors.text }}>
              AI Assistant
            </h3>
            <p style={{ ...styles.subtext, color: theme.colors.textMuted }}>
              Choose how you want to run the AI assistant
            </p>
          </div>

          <div style={styles.buttonList as React.CSSProperties}>
            {/* Local option */}
            {hasLocal && (
              <button
                onClick={() => setSelectedProvider('local')}
                style={{
                  ...styles.providerButton,
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div style={styles.providerButtonContent}>
                  <div style={{ ...styles.iconWrapper, background: theme.colors.backgroundTertiary }}>
                    <CpuIcon size={20} style={{ color: theme.colors.primary }} />
                  </div>
                  <div style={styles.flexOne}>
                    <div style={styles.nameRow}>
                      <span style={{ color: theme.colors.text, fontWeight: 600 }}>
                        {localMeta.name}
                      </span>
                      {localMeta.badge && (
                        <span
                          style={{
                            ...styles.badge,
                            background: theme.colors[localMeta.badgeVariant || 'success'] + '20',
                            color: theme.colors[localMeta.badgeVariant || 'success'],
                          }}
                        >
                          {localMeta.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ ...styles.subtext, color: theme.colors.textMuted, marginTop: '4px' }}>
                      {localMeta.description}
                    </p>
                    {localMeta.requirements && (
                      <p style={{ ...styles.smallText, color: theme.colors.textMuted }}>
                        {localMeta.requirements}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Cloud option */}
            {hasCloud && (
              <button
                onClick={() => setSelectedProvider('cloud')}
                style={{
                  ...styles.providerButton,
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div style={styles.providerButtonContent}>
                  <div style={{ ...styles.iconWrapper, background: theme.colors.backgroundTertiary }}>
                    <CloudIcon size={20} style={{ color: theme.colors.info }} />
                  </div>
                  <div style={styles.flexOne}>
                    <div style={styles.nameRow}>
                      <span style={{ color: theme.colors.text, fontWeight: 600 }}>
                        {cloudMeta.name}
                      </span>
                      {cloudMeta.badge && (
                        <span
                          style={{
                            ...styles.badge,
                            background: theme.colors[cloudMeta.badgeVariant || 'info'] + '20',
                            color: theme.colors[cloudMeta.badgeVariant || 'info'],
                          }}
                        >
                          {cloudMeta.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ ...styles.subtext, color: theme.colors.textMuted, marginTop: '4px' }}>
                      {cloudMeta.description}
                    </p>
                    {cloudMeta.requirements && (
                      <p style={{ ...styles.smallText, color: theme.colors.textMuted }}>
                        {cloudMeta.requirements}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Local model selection screen
  if (
    selectedProvider === 'local' &&
    localProvider?.status === 'idle' &&
    !selectedModelId &&
    config.availableModels?.length
  ) {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          background: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
          boxSizing: 'border-box',
        }}
      >
        {/* Back button */}
        <button
          onClick={handleBack}
          style={{ ...styles.backButton, color: theme.colors.textMuted }}
        >
          <ChevronLeftIcon size={16} />
          Back
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...styles.contentWrapper, gap: '16px' } as React.CSSProperties}>
            <div style={styles.textCenter as React.CSSProperties}>
              <h3 style={{ ...styles.heading, color: theme.colors.text }}>
                Select Local Model
              </h3>
              <p style={{ ...styles.subtext, color: theme.colors.textMuted }}>
                Models are downloaded once and cached in your browser.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {config.availableModels.map((model: AIModelDefinition) => (
                <button
                  key={model.id}
                  onClick={() => handleLocalModelSelect(model.id)}
                  style={{
                    ...styles.modelButton,
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div style={styles.modelButtonContent}>
                    <span style={{ color: theme.colors.text, fontWeight: 500 }}>
                      {model.name}
                    </span>
                    <span
                      style={{
                        ...styles.badge,
                        background: theme.colors.backgroundTertiary,
                        color: theme.colors.textMuted,
                      }}
                    >
                      {model.size}
                    </span>
                  </div>
                  {model.description && (
                    <p style={{ ...styles.smallText, color: theme.colors.textMuted, marginTop: '4px' }}>
                      {model.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface if we have a handler
  if (customHandler) {
    const currentModel = config.availableModels?.find((m) => m.id === selectedModelId);

    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Provider indicator header */}
        <div
          style={{
            ...styles.header,
            background: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
        >
          <button
            onClick={handleBack}
            style={{ ...styles.headerButton, color: theme.colors.textMuted }}
          >
            <ChevronLeftIcon size={14} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {selectedProvider === 'local' ? (
                <>
                  <CpuIcon size={12} />
                  {currentModel?.name || 'Local'}
                </>
              ) : (
                <>
                  <CloudIcon size={12} />
                  {cloudMeta.name}
                </>
              )}
            </span>
          </button>
          <button
            onClick={() => customHandler?.clearMessages?.()}
            style={{ ...styles.headerButton, color: theme.colors.textMuted }}
            title="New conversation"
          >
            <PlusIcon size={14} />
            <span>New</span>
          </button>
        </div>

        <div style={styles.chatContainer}>
          <ThemedAIChat
            theme={theme}
            customHandler={customHandler}
            placeholder={placeholder}
            showLoadingIndicator={true}
            onFinish={handleFinish}
            onError={handleError}
          />
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div
      style={{
        ...styles.fullContainer,
        background: theme.colors.background,
        color: theme.colors.textMuted,
      }}
    >
      Loading...
    </div>
  );
}
