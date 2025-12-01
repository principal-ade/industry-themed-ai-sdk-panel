/**
 * Context enrichment utilities for panel integration
 */

export function enrichContextWithPanel(context: any): Record<string, unknown> {
  // Placeholder - will be implemented when we add panel support
  return {
    repository: context?.repositoryPath || null,
  };
}
