# useContextManager

The `useContextManager` hook provides a complete interface for managing the context system in ReactNativeLLM, including initialization, state management, and context operations.

## 📋 Overview

**Location**: `src/hooks/useContextManager.ts`
**Purpose**: Centralized context system management

This hook encapsulates all context-related functionality, providing a clean interface for components to interact with the context system without dealing with implementation details.

## 🎯 Hook Interface

### Parameters

```typescript
interface UseContextManagerProps {
  initialContextEnabled?: boolean;  // Initial context enable state
}
```

### Return Value

```typescript
interface UseContextManagerReturn {
  contextAvailable: boolean;                                    // Whether context file exists
  contextEnabled: boolean;                                      // Whether context is enabled
  setContextEnabled: (enabled: boolean) => void;               // Enable/disable context
  handleCreateTestContext: () => Promise<void>;                // Create test context file
  handleRefreshContext: () => Promise<void>;                   // Manually refresh context
  getContextForQuery: (query: string) => Promise<string | null>; // Get context for query
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import { useContextManager } from '../hooks/useContextManager';

const ChatScreen: React.FC = () => {
  const {
    contextAvailable,
    contextEnabled,
    setContextEnabled,
    getContextForQuery,
  } = useContextManager();

  // Use context in chat messages
  const { displayedMessages, onSend } = useChatMessages({
    modelId: 'llama-2-7b',
    getContextForQuery: contextEnabled ? getContextForQuery : undefined,
    contextEnabled,
    contextAvailable,
  });

  return (
    <View>
      <ContextToggleButton
        enabled={contextEnabled}
        available={contextAvailable}
        onToggle={setContextEnabled}
      />
      <CustomGiftedChat
        messages={displayedMessages}
        onSend={onSend}
      />
    </View>
  );
};
```

### With Initial State

```typescript
const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  
  // Get initial state from store
  const initialState = getChatScreenState(modelId);
  
  const {
    contextAvailable,
    contextEnabled,
    setContextEnabled,
    handleCreateTestContext,
    handleRefreshContext,
    getContextForQuery,
  } = useContextManager({
    initialContextEnabled: initialState?.contextEnabled,
  });

  return (
    <ChatHeader
      modelId={modelId}
      contextEnabled={contextEnabled}
      contextAvailable={contextAvailable}
      onContextToggle={setContextEnabled}
      onCreateTestContext={handleCreateTestContext}
      onRefreshContext={handleRefreshContext}
    />
  );
};
```

### In Model Selection Screen

```typescript
const ModelSelectionScreen: React.FC = () => {
  const {
    contextAvailable,
    handleRefreshContext,
  } = useContextManager();

  return (
    <View>
      <ContextStatusIndicator 
        contextAvailable={contextAvailable} 
        onRefresh={handleRefreshContext} 
      />
      <ModelSelection {...modelProps} />
    </View>
  );
};
```

## 🔧 Internal Implementation

### Context Manager Integration

```typescript
export const useContextManager = (props?: UseContextManagerProps) => {
  const [contextAvailable, setContextAvailable] = useState<boolean>(false);
  const [contextEnabled, setContextEnabled] = useState<boolean>(
    props?.initialContextEnabled ?? true
  );

  // Initialize context manager and check availability
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

    // Cleanup on unmount
    return () => {
      MCPContextManager.cleanup();
    };
  }, []);
};
```

### Test Context Creation

```typescript
const handleCreateTestContext = useCallback(async () => {
  try {
    console.log('🧪 Creating test context file...');
    const success = await TestContextHelper.createTestContextFile();
    if (success) {
      // Refresh context manager
      await MCPContextManager.forceRefresh();
      setContextAvailable(MCPContextManager.isContextAvailable());
      console.log('🎉 Test context created and loaded!');
    }
  } catch (error) {
    console.error('Error creating test context:', error);
  }
}, []);
```

### Manual Context Refresh

```typescript
const handleRefreshContext = useCallback(async () => {
  try {
    console.log('🔄 Manually refreshing context...');
    await MCPContextManager.forceRefresh();
    setContextAvailable(MCPContextManager.isContextAvailable());
    console.log('✅ Context refreshed successfully!');
  } catch (error) {
    console.error('Error refreshing context:', error);
  }
}, []);
```

### Context Query Handler

```typescript
const getContextForQuery = useCallback(async (query: string): Promise<string | null> => {
  if (!contextEnabled || !contextAvailable) {
    return null;
  }
  return MCPContextManager.getContextForQuery(query);
}, [contextEnabled, contextAvailable]);
```

## 🔄 State Management

### Context Availability

The hook tracks whether a context file is available:

```typescript
// Updated during initialization and refresh
setContextAvailable(MCPContextManager.isContextAvailable());
```

### Context Enable State

Users can toggle context on/off:

```typescript
const [contextEnabled, setContextEnabled] = useState<boolean>(
  props?.initialContextEnabled ?? true
);
```

### State Synchronization

Context state is synchronized with the underlying manager:

```typescript
// Check availability after operations
await MCPContextManager.forceRefresh();
setContextAvailable(MCPContextManager.isContextAvailable());
```

## 🎯 Context Operations

### Initialization Process

1. **Mount Effect**: Hook initializes on component mount
2. **Manager Setup**: `MCPContextManager.initialize()` called
3. **Availability Check**: Context file existence verified
4. **State Update**: Component state updated with availability

### Refresh Process

1. **User Action**: User triggers refresh (button press)
2. **Force Refresh**: `MCPContextManager.forceRefresh()` called
3. **File Re-read**: Context file is re-read and processed
4. **State Update**: Availability status updated

### Test Context Creation

1. **User Action**: Long press on context toggle when unavailable
2. **File Creation**: `TestContextHelper.createTestContextFile()` called
3. **Manager Refresh**: Context manager refreshes to load new file
4. **State Update**: Context becomes available

## 🧪 Testing

### Unit Tests

```typescript
describe('useContextManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize context manager on mount', async () => {
    const initializeSpy = jest.spyOn(MCPContextManager, 'initialize');
    const isAvailableSpy = jest.spyOn(MCPContextManager, 'isContextAvailable')
      .mockReturnValue(true);

    const { result, waitFor } = renderHook(() => useContextManager());

    await waitFor(() => {
      expect(initializeSpy).toHaveBeenCalled();
      expect(result.current.contextAvailable).toBe(true);
    });
  });

  it('should create test context when requested', async () => {
    const createTestContextSpy = jest.spyOn(TestContextHelper, 'createTestContextFile')
      .mockResolvedValue(true);
    const forceRefreshSpy = jest.spyOn(MCPContextManager, 'forceRefresh')
      .mockResolvedValue(true);

    const { result } = renderHook(() => useContextManager());

    await act(async () => {
      await result.current.handleCreateTestContext();
    });

    expect(createTestContextSpy).toHaveBeenCalled();
    expect(forceRefreshSpy).toHaveBeenCalled();
  });

  it('should refresh context when requested', async () => {
    const forceRefreshSpy = jest.spyOn(MCPContextManager, 'forceRefresh')
      .mockResolvedValue(true);
    const isAvailableSpy = jest.spyOn(MCPContextManager, 'isContextAvailable')
      .mockReturnValue(true);

    const { result } = renderHook(() => useContextManager());

    await act(async () => {
      await result.current.handleRefreshContext();
    });

    expect(forceRefreshSpy).toHaveBeenCalled();
    expect(isAvailableSpy).toHaveBeenCalled();
  });

  it('should return context for query when enabled and available', async () => {
    const getContextSpy = jest.spyOn(MCPContextManager, 'getContextForQuery')
      .mockResolvedValue('test context');

    const { result } = renderHook(() => useContextManager());

    // Set up context as enabled and available
    act(() => {
      result.current.setContextEnabled(true);
    });

    // Mock availability
    jest.spyOn(MCPContextManager, 'isContextAvailable').mockReturnValue(true);

    const context = await result.current.getContextForQuery('test query');

    expect(getContextSpy).toHaveBeenCalledWith('test query');
    expect(context).toBe('test context');
  });

  it('should return null for query when context disabled', async () => {
    const { result } = renderHook(() => useContextManager());

    act(() => {
      result.current.setContextEnabled(false);
    });

    const context = await result.current.getContextForQuery('test query');

    expect(context).toBeNull();
  });
});
```

### Integration Tests

```typescript
describe('useContextManager Integration', () => {
  it('should integrate with context file system', async () => {
    // Create actual test file
    const testFilePath = `${RNFS.DocumentDirectoryPath}/context.md`;
    await RNFS.writeFile(testFilePath, '# Test Context\n\nTest content', 'utf8');

    const { result, waitFor } = renderHook(() => useContextManager());

    await waitFor(() => {
      expect(result.current.contextAvailable).toBe(true);
    });

    // Cleanup
    await RNFS.unlink(testFilePath);
  });

  it('should work with chat messages hook', async () => {
    const TestComponent = () => {
      const contextManager = useContextManager();
      const chatMessages = useChatMessages({
        modelId: 'test-model',
        getContextForQuery: contextManager.getContextForQuery,
        contextEnabled: contextManager.contextEnabled,
        contextAvailable: contextManager.contextAvailable,
      });

      return {
        ...contextManager,
        ...chatMessages,
      };
    };

    const { result } = renderHook(() => TestComponent());

    // Test integration between hooks
    expect(result.current.contextEnabled).toBeDefined();
    expect(result.current.displayedMessages).toBeDefined();
  });
});
```

## ⚡ Performance Considerations

### Initialization Optimization

```typescript
// Initialize only once on mount
useEffect(() => {
  const initializeContext = async () => {
    // Initialization logic
  };
  initializeContext();
}, []); // Empty dependency array
```

### Callback Memoization

```typescript
// Memoized callbacks prevent unnecessary re-renders
const handleCreateTestContext = useCallback(async () => {
  // Implementation
}, []);

const getContextForQuery = useCallback(async (query: string) => {
  // Implementation
}, [contextEnabled, contextAvailable]);
```

### Error Handling

```typescript
// Graceful error handling
try {
  await MCPContextManager.initialize();
  setContextAvailable(MCPContextManager.isContextAvailable());
} catch (error) {
  console.warn('Error initializing context manager:', error);
  // Continue with context unavailable
}
```

## 🔧 Advanced Usage

### Custom Context Operations

```typescript
const useAdvancedContextManager = () => {
  const baseManager = useContextManager();
  const [contextStats, setContextStats] = useState(null);

  const getContextStats = useCallback(async () => {
    const stats = MCPContextManager.getContextStats();
    setContextStats(stats);
    return stats;
  }, []);

  const getContextMetadata = useCallback(async () => {
    return MCPContextManager.getContextMetadata();
  }, []);

  return {
    ...baseManager,
    contextStats,
    getContextStats,
    getContextMetadata,
  };
};
```

### Context with Loading States

```typescript
const useContextManagerWithLoading = () => {
  const baseManager = useContextManager();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  const handleRefreshContext = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await baseManager.handleRefreshContext();
    } finally {
      setIsRefreshing(false);
    }
  }, [baseManager.handleRefreshContext]);

  const handleCreateTestContext = useCallback(async () => {
    setIsCreatingTest(true);
    try {
      await baseManager.handleCreateTestContext();
    } finally {
      setIsCreatingTest(false);
    }
  }, [baseManager.handleCreateTestContext]);

  return {
    ...baseManager,
    isRefreshing,
    isCreatingTest,
    handleRefreshContext,
    handleCreateTestContext,
  };
};
```

## 🔮 Future Enhancements

Potential improvements to useContextManager:

- **Context Caching**: Cache context results for better performance
- **Multiple Context Files**: Support for multiple context sources
- **Context Analytics**: Track context usage and effectiveness
- **Auto-Refresh**: Automatic context refresh on file changes
- **Context Validation**: Validate context file format and content
- **Context Backup**: Backup and restore context files
- **Context Sharing**: Share context between devices
- **Context Templates**: Predefined context templates

## 🚨 Common Issues

### Context Not Loading
- **Check File Path**: Verify context file is in correct location
- **Check Permissions**: Ensure app has file system access
- **Check Format**: Verify context file is valid markdown

### Context Not Updating
- **Manual Refresh**: Use refresh button to force update
- **File Changes**: Ensure file changes are saved properly
- **Manager State**: Check if context manager is properly initialized

### Performance Issues
- **Large Files**: Very large context files may impact performance
- **Frequent Queries**: Consider caching for repeated queries
- **Memory Usage**: Monitor memory usage with large context files

---

*useContextManager provides a comprehensive interface for intelligent context integration!* 🧠🔗