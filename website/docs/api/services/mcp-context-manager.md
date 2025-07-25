# MCPContextManager

The `MCPContextManager` is the core service responsible for managing the Model Context Protocol (MCP) integration in ReactNativeLLM. It handles context file processing, relevance scoring, and context injection into AI conversations.

## 📋 Overview

**Location**: `src/services/MCPContextManager.ts`
**Pattern**: Singleton
**Purpose**: Central management of context system functionality

The MCPContextManager serves as the primary interface between the app and the context system, providing a clean API for context operations while managing the complex underlying processing.

## 🏗️ Architecture

### Singleton Pattern

```typescript
class MCPContextManager {
  private contextDocument: ContextDocument | null = null;
  private lastFileCheck: Date | null = null;
  private isInitialized = false;

  // Private constructor prevents direct instantiation
  // Exported as singleton instance
}

export default new MCPContextManager();
```

### Dependencies

- **ContextFileManager**: File system operations
- **ContextProcessor**: Content processing and relevance scoring
- **ContextConfig**: Configuration constants

## 🎯 Public API

### Initialization

#### `initialize(): Promise<void>`

Initializes the context system and loads available context files.

```typescript
await MCPContextManager.initialize();
```

**Process**:
1. Checks for context file existence
2. Loads and processes context if available
3. Sets up the context system for use
4. Marks manager as initialized

**Usage Example**:
```typescript
// In useContextManager hook
useEffect(() => {
  const initializeContext = async () => {
    try {
      await MCPContextManager.initialize();
      setContextAvailable(MCPContextManager.isContextAvailable());
    } catch (error) {
      console.warn('Error initializing context manager:', error);
    }
  };

  initializeContext();
}, []);
```

### Context Availability

#### `isContextAvailable(): boolean`

Returns whether valid context is currently available.

```typescript
const available = MCPContextManager.isContextAvailable();
```

**Returns**: `true` if context file exists, is valid, and has processed chunks

**Usage Example**:
```typescript
// Check before enabling context features
if (MCPContextManager.isContextAvailable()) {
  setContextEnabled(true);
} else {
  setContextEnabled(false);
}
```

### Context Retrieval

#### `getContextForQuery(userQuery: string): Promise<string | null>`

Retrieves relevant context for a user query, if available.

```typescript
const context = await MCPContextManager.getContextForQuery("How do I build React Native apps?");
```

**Parameters**:
- `userQuery: string` - The user's question or message

**Returns**: 
- `Promise<string | null>` - Formatted context prompt or null if no relevant context

**Process**:
1. Validates context availability
2. Extracts relevant chunks using ContextProcessor
3. Builds formatted context prompt
4. Returns null if no relevant context found

**Usage Example**:
```typescript
// In useChatMessages hook
if (contextEnabled && contextAvailable && getContextForQuery) {
  contextContent = await MCPContextManager.getContextForQuery(userQuery);
  if (contextContent) {
    currentUserContent = `${contextContent}\n\nUser Question: ${userQuery}`;
  }
}
```

### Manual Refresh

#### `forceRefresh(): Promise<boolean>`

Forces a reload of the context from the file system.

```typescript
const success = await MCPContextManager.forceRefresh();
```

**Returns**: `boolean` - Whether context is available after refresh

**Usage Example**:
```typescript
// Refresh button handler
const handleRefreshContext = async () => {
  try {
    console.log('🔄 Manually refreshing context...');
    await MCPContextManager.forceRefresh();
    setContextAvailable(MCPContextManager.isContextAvailable());
    console.log('✅ Context refreshed successfully!');
  } catch (error) {
    console.error('Error refreshing context:', error);
  }
};
```

### Metadata Access

#### `getContextMetadata(): Promise<object | null>`

Returns metadata about the current context state.

```typescript
const metadata = await MCPContextManager.getContextMetadata();
```

**Returns**: Object containing:
- File metadata (size, modification date, path)
- Processing information (chunks count, last processed)
- Availability status

**Usage Example**:
```typescript
// Debug context information
const metadata = await MCPContextManager.getContextMetadata();
console.log('Context metadata:', metadata);
```

#### `getContextStats(): object`

Returns current context statistics without async operations.

```typescript
const stats = MCPContextManager.getContextStats();
```

**Returns**: Object containing:
- `available: boolean` - Whether context is available
- `chunksCount: number` - Number of processed chunks
- `fileSize: number` - Size of context file in bytes
- `lastModified: Date | null` - File modification date
- `lastProcessed: Date | null` - Processing timestamp

### Utility Methods

#### `getContextFilePath(): string`

Returns the path where context files are expected.

```typescript
const path = MCPContextManager.getContextFilePath();
// Returns: /path/to/documents/context.md
```

#### `cleanup(): void`

Cleans up resources and resets the manager state.

```typescript
MCPContextManager.cleanup();
```

**Usage**: Call on app unmount or when context system is no longer needed.

## 🔧 Internal Implementation

### Context Processing

```typescript
async refreshContext(): Promise<void> {
  try {
    const contextDoc = await ContextFileManager.readContextFile();
    
    if (contextDoc) {
      // Process the content into chunks
      const chunks = ContextProcessor.processContextContent(contextDoc.content);
      
      this.contextDocument = {
        ...contextDoc,
        chunks
      };
      
      this.lastFileCheck = new Date();
      console.log(`Context refreshed: ${chunks.length} chunks processed`);
    } else {
      this.contextDocument = null;
      console.log('No context file found or file is empty');
    }
  } catch (error) {
    console.warn('Error refreshing context:', error);
    this.contextDocument = null;
  }
}
```

### Context Query Processing

```typescript
async getContextForQuery(userQuery: string): Promise<string | null> {
  try {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.isContextAvailable()) {
      console.log('❌ Context not available - no file or invalid');
      return null;
    }

    console.log(`🔍 Processing query: "${userQuery}"`);
    console.log(`📚 Available chunks: ${this.contextDocument!.chunks.length}`);

    // Find relevant chunks
    const relevantChunks = ContextProcessor.extractRelevantChunks(
      userQuery, 
      this.contextDocument!.chunks
    );

    if (relevantChunks.length === 0) {
      console.log('⚠️ No relevant context found for query:', userQuery);
      return null;
    }

    // Build context prompt
    const contextPrompt = ContextProcessor.buildContextPrompt(userQuery, relevantChunks);
    
    console.log(`✅ Found ${relevantChunks.length} relevant context chunks`);
    return contextPrompt;
  } catch (error) {
    console.warn('Error getting context for query:', error);
    return null;
  }
}
```

## 📊 Performance Considerations

### Memory Management

The manager maintains minimal memory footprint:

```typescript
// Only stores processed document, not raw file content
private contextDocument: ContextDocument | null = null;

// Efficient chunk storage with metadata
interface ContextDocument {
  content: string;           // Original content
  chunks: ContextChunk[];    // Processed chunks with keywords
  lastModified: Date;        // File timestamp
  size: number;             // File size
  isValid: boolean;         // Validation status
}
```

### Lazy Loading

Context is only processed when needed:

```typescript
if (!this.isInitialized) {
  await this.initialize();
}
```

### Efficient Relevance Scoring

Uses optimized keyword matching:

```typescript
// Delegates to ContextProcessor for efficient processing
const relevantChunks = ContextProcessor.extractRelevantChunks(
  userQuery, 
  this.contextDocument!.chunks
);
```

## 🧪 Testing

### Unit Tests

```typescript
describe('MCPContextManager', () => {
  beforeEach(() => {
    // Reset singleton state
    MCPContextManager.cleanup();
  });

  it('should initialize without context file', async () => {
    mockContextFileManager.checkContextFileExists.mockResolvedValue(false);
    
    await MCPContextManager.initialize();
    
    expect(MCPContextManager.isContextAvailable()).toBe(false);
  });

  it('should process context when file exists', async () => {
    const mockContext = {
      content: '# Test Context\n\nThis is test content.',
      lastModified: new Date(),
      size: 100,
      isValid: true,
    };
    
    mockContextFileManager.readContextFile.mockResolvedValue(mockContext);
    mockContextProcessor.processContextContent.mockReturnValue([
      { id: '1', content: 'test chunk', keywords: ['test'] }
    ]);
    
    await MCPContextManager.initialize();
    
    expect(MCPContextManager.isContextAvailable()).toBe(true);
  });

  it('should return relevant context for query', async () => {
    // Setup mock context
    await setupMockContext();
    
    const result = await MCPContextManager.getContextForQuery('test query');
    
    expect(result).toBeTruthy();
    expect(result).toContain('CONTEXT ACTIVE');
  });

  it('should handle errors gracefully', async () => {
    mockContextProcessor.extractRelevantChunks.mockImplementation(() => {
      throw new Error('Processing error');
    });
    
    const result = await MCPContextManager.getContextForQuery('test');
    
    expect(result).toBeNull();
  });
});
```

### Integration Tests

```typescript
describe('MCPContextManager Integration', () => {
  it('should integrate with file system', async () => {
    // Create actual test file
    await createTestContextFile();
    
    await MCPContextManager.initialize();
    
    expect(MCPContextManager.isContextAvailable()).toBe(true);
    
    // Cleanup
    await deleteTestContextFile();
  });

  it('should work with real context processor', async () => {
    await setupRealContext();
    
    const result = await MCPContextManager.getContextForQuery('React Native');
    
    expect(result).toBeTruthy();
    expect(result).toContain('React Native');
  });
});
```

## 🚨 Error Handling

### Graceful Degradation

The manager handles errors without breaking the app:

```typescript
try {
  contextContent = await MCPContextManager.getContextForQuery(userQuery);
} catch (error) {
  console.warn('Context retrieval failed:', error);
  // App continues without context
  contextContent = null;
}
```

### File System Errors

```typescript
catch (error) {
  console.warn('Error refreshing context:', error);
  this.contextDocument = null; // Reset to safe state
}
```

### Processing Errors

```typescript
catch (error) {
  console.warn('Error getting context for query:', error);
  return null; // Safe fallback
}
```

## 🔍 Debugging

### Debug Logging

The manager provides comprehensive logging:

```typescript
console.log('Initializing MCP Context Manager...');
console.log('Looking for context file at:', ContextFileManager.getContextFilePath());
console.log(`🔍 Processing query: "${userQuery}"`);
console.log(`📚 Available chunks: ${this.contextDocument!.chunks.length}`);
console.log(`✅ Found ${relevantChunks.length} relevant context chunks`);
```

### Status Methods

```typescript
// Check manager state
console.log('Initialized:', MCPContextManager.isInitialized);
console.log('Context available:', MCPContextManager.isContextAvailable());
console.log('Context stats:', MCPContextManager.getContextStats());
```

## 🔮 Future Enhancements

Planned improvements to MCPContextManager:

- **Multiple Context Files**: Support for multiple context sources
- **Context Caching**: Cache processed chunks for performance
- **Dynamic Context**: Context that changes based on app state
- **Context Analytics**: Track which context is most useful
- **Background Processing**: Process context changes in background
- **Context Versioning**: Track and manage context file versions

---

*MCPContextManager provides the intelligent context integration that makes conversations more relevant and personalized!* 🧠💬