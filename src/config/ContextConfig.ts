import { MCPContextConfig } from '../types/ContextTypes';

export const DEFAULT_MCP_CONFIG: MCPContextConfig = {
  contextFilePath: 'context.md',
  maxContextTokens: 4000,
  relevanceThreshold: 0.05, // Very low threshold to ensure context is included
  enableContextInjection: true,
  contextCheckInterval: 5000, // Check every 5 seconds
};

export const CONTEXT_CONSTANTS = {
  CHUNK_SIZE: 500, // Maximum tokens per chunk
  CHUNK_OVERLAP: 50, // Overlap between chunks
  MIN_KEYWORD_LENGTH: 3, // Minimum keyword length
  MAX_CHUNKS_PER_QUERY: 5, // Maximum chunks to include in context
} as const; 