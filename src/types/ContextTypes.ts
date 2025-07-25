// Context system type definitions for MCP integration

export interface ContextDocument {
  content: string;
  lastModified: Date;
  size: number;
  chunks: ContextChunk[];
  isValid: boolean;
}

export interface ContextChunk {
  id: string;
  content: string;
  keywords: string[];
  section?: string;
  relevanceScore?: number;
}

export interface MCPContextConfig {
  contextFilePath: string;
  maxContextTokens: number;
  relevanceThreshold: number;
  enableContextInjection: boolean;
  contextCheckInterval: number;
}

export interface ChatScreenState {
  messages: any[]; // IMessage[] - keeping generic for now
  preparing: boolean;
  prepared: boolean;
  contextEnabled?: boolean;
}

export interface ContextMetadata {
  usedContext: boolean;
  contextFile?: string | null;
  contextEnabled: boolean;
} 