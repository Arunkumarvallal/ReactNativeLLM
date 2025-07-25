# useChatScreenState

The `useChatScreenState` hook manages persistence of chat screen state across navigation and app lifecycle events.

## 📋 Overview

**Location**: `src/hooks/useChatScreenState.ts`
**Purpose**: Persist and restore chat state per model

This hook ensures that chat messages, model preparation status, and context settings are maintained when users navigate between screens or restart the app.

## 🎯 Hook Interface

### Parameters

```typescript
interface UseChatScreenStateProps {
  modelId?: string;         // Current model identifier
  messages: IMessage[];     // Current message list
  preparing: boolean;       // Model preparation status
  prepared: boolean;        // Model ready status
  contextEnabled: boolean;  // Context system status
}
```

### Return Value

```typescript
interface UseChatScreenStateReturn {
  getInitialState: () => ChatScreenState | undefined;  // Get stored state for model
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import { useChatScreenState } from '../hooks/useChatScreenState';

const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [preparing, setPreparing] = useState(true);
  const [prepared, setPrepared] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);

  // Persist state automatically
  useChatScreenState({
    modelId,
    messages,
    preparing,
    prepared,
    contextEnabled,
  });

  // Component logic
};
```

### With Initial State Restoration

```typescript
const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  
  // Get initial state from store
  const initialState = modelId ? getChatScreenState(modelId) : undefined;
  
  // Initialize with stored state
  const [messages, setMessages] = useState<IMessage[]>(
    initialState?.messages || []
  );
  const [preparing, setPreparing] = useState(
    initialState?.preparing ?? true
  );
  const [prepared, setPrepared] = useState(
    initialState?.prepared ?? false
  );
  const [contextEnabled, setContextEnabled] = useState(
    initialState?.contextEnabled ?? true
  );

  // Persist current state
  const { getInitialState } = useChatScreenState({
    modelId,
    messages,
    preparing,
    prepared,
    contextEnabled,
  });

  // Use getInitialState if needed for additional logic
};
```

### Integration with Other Hooks

```typescript
const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  
  // Get initial state
  const initialState = modelId ? getChatScreenState(modelId) : undefined;
  
  // Context management with initial state
  const {
    contextAvailable,
    contextEnabled,
    setContextEnabled,
    getContextForQuery,
  } = useContextManager({
    initialContextEnabled: initialState?.contextEnabled,
  });

  // Chat messages with initial state
  const { displayedMessages, text, setText, onSend } = useChatMessages({
    modelId,
    initialMessages: initialState?.messages || [],
    getContextForQuery,
    contextEnabled,
    contextAvailable,
  });

  // Model preparation with initial state
  const { preparing, prepared } = useModelPreparation({
    modelId,
    initialPreparing: initialState?.preparing ?? true,
    initialPrepared: initialState?.prepared ?? false,
  });

  // State persistence
  useChatScreenState({
    modelId,
    messages: displayedMessages,
    preparing,
    prepared,
    contextEnabled,
  });
};
```

## 🔧 Internal Implementation

### State Persistence

```typescript
export const useChatScreenState = ({
  modelId,
  messages,
  preparing,
  prepared,
  contextEnabled,
}: UseChatScreenStateProps) => {
  // Get initial state from store
  const getInitialState = () => {
    if (!modelId) return undefined;
    return getChatScreenState(modelId);
  };

  // Persist state to store on every change
  useEffect(() => {
    if (modelId) {
      setChatScreenState(modelId, {
        messages,
        preparing,
        prepared,
        contextEnabled,
      });
    }
  }, [modelId, messages, preparing, prepared, contextEnabled]);

  return {
    getInitialState,
  };
};
```

### Store Integration

The hook integrates with `ChatScreenStore` for state management:

```typescript
// From ChatScreenStore.ts
interface ChatScreenState {
  messages: IMessage[];
  preparing: boolean;
  prepared: boolean;
  contextEnabled?: boolean;
}

// Store operations
getChatScreenState(modelId: string): ChatScreenState | undefined
setChatScreenState(modelId: string, state: ChatScreenState): void
clearChatScreenState(modelId: string): void
```

## 📊 State Management

### Per-Model State

Each model maintains separate state:

```typescript
// State is stored with modelId as key
const chatScreenStore: Record<string, ChatScreenState> = {
  'llama-2-7b': {
    messages: [...],
    preparing: false,
    prepared: true,
    contextEnabled: true,
  },
  'mistral-7b': {
    messages: [...],
    preparing: true,
    prepared: false,
    contextEnabled: false,
  },
};
```

### State Persistence Lifecycle

1. **Initial Load**: Retrieve stored state for model
2. **Runtime Updates**: Automatically save state changes
3. **Navigation**: State persists across screen transitions
4. **App Restart**: State remains in memory (not persistent across app kills)

## 🔄 State Synchronization

### Automatic Updates

```typescript
// State is automatically saved when any dependency changes
useEffect(() => {
  if (modelId) {
    setChatScreenState(modelId, {
      messages,
      preparing,
      prepared,
      contextEnabled,
    });
  }
}, [modelId, messages, preparing, prepared, contextEnabled]);
```

### Dependency Management

The hook watches all state properties:
- **Messages**: Chat message array
- **Preparing**: Model preparation status
- **Prepared**: Model ready status
- **Context Enabled**: Context system toggle state

## 🧪 Testing

### Unit Tests

```typescript
describe('useChatScreenState', () => {
  beforeEach(() => {
    // Clear store before each test
    jest.clearAllMocks();
  });

  it('should return initial state for existing model', () => {
    const mockState = {
      messages: [],
      preparing: false,
      prepared: true,
      contextEnabled: true,
    };
    
    // Mock store with existing state
    getChatScreenState.mockReturnValue(mockState);
    
    const { result } = renderHook(() => useChatScreenState({
      modelId: 'test-model',
      messages: [],
      preparing: true,
      prepared: false,
      contextEnabled: false,
    }));
    
    expect(result.current.getInitialState()).toEqual(mockState);
  });

  it('should persist state changes', () => {
    const mockMessages = [
      { _id: '1', text: 'Hello', createdAt: new Date(), user: { _id: 1 } }
    ];
    
    renderHook(() => useChatScreenState({
      modelId: 'test-model',
      messages: mockMessages,
      preparing: false,
      prepared: true,
      contextEnabled: true,
    }));
    
    expect(setChatScreenState).toHaveBeenCalledWith('test-model', {
      messages: mockMessages,
      preparing: false,
      prepared: true,
      contextEnabled: true,
    });
  });

  it('should not persist when modelId is undefined', () => {
    renderHook(() => useChatScreenState({
      modelId: undefined,
      messages: [],
      preparing: false,
      prepared: false,
      contextEnabled: false,
    }));
    
    expect(setChatScreenState).not.toHaveBeenCalled();
  });

  it('should update state when dependencies change', () => {
    const { rerender } = renderHook(
      (props) => useChatScreenState(props),
      {
        initialProps: {
          modelId: 'test-model',
          messages: [],
          preparing: true,
          prepared: false,
          contextEnabled: false,
        }
      }
    );
    
    // Change state
    rerender({
      modelId: 'test-model',
      messages: [],
      preparing: false,
      prepared: true,
      contextEnabled: true,
    });
    
    expect(setChatScreenState).toHaveBeenCalledWith('test-model', {
      messages: [],
      preparing: false,
      prepared: true,
      contextEnabled: true,
    });
  });
});
```

### Integration Tests

```typescript
describe('useChatScreenState Integration', () => {
  it('should integrate with ChatScreen component', () => {
    const TestChatScreen = ({ modelId }: { modelId: string }) => {
      const [messages, setMessages] = useState<IMessage[]>([]);
      const [preparing, setPreparing] = useState(true);
      
      useChatScreenState({
        modelId,
        messages,
        preparing,
        prepared: false,
        contextEnabled: true,
      });
      
      return (
        <View testID="chat-screen">
          <Button
            title="Add Message"
            onPress={() => setMessages([
              { _id: '1', text: 'Test', createdAt: new Date(), user: { _id: 1 } }
            ])}
          />
        </View>
      );
    };
    
    const { getByTitle } = render(
      <TestChatScreen modelId="test-model" />
    );
    
    fireEvent.press(getByTitle('Add Message'));
    
    // State should be persisted
    expect(setChatScreenState).toHaveBeenCalled();
  });
});
```

## ⚡ Performance Considerations

### Efficient Updates

```typescript
// Only updates when dependencies actually change
useEffect(() => {
  if (modelId) {
    setChatScreenState(modelId, {
      messages,
      preparing,
      prepared,
      contextEnabled,
    });
  }
}, [modelId, messages, preparing, prepared, contextEnabled]);
```

### Memory Management

- **In-Memory Store**: State is stored in memory only
- **No Persistence**: State doesn't survive app kills
- **Model Isolation**: Each model has separate state
- **Cleanup**: No automatic cleanup (could be added)

### Optimization Strategies

```typescript
// Potential optimization: Debounced updates
const useDebouncedChatScreenState = (props: UseChatScreenStateProps) => {
  const debouncedProps = useDebounce(props, 500);
  return useChatScreenState(debouncedProps);
};

// Potential optimization: Selective updates
const useOptimizedChatScreenState = (props: UseChatScreenStateProps) => {
  const prevPropsRef = useRef(props);
  
  useEffect(() => {
    const hasChanged = !isEqual(prevPropsRef.current, props);
    if (hasChanged && props.modelId) {
      setChatScreenState(props.modelId, {
        messages: props.messages,
        preparing: props.preparing,
        prepared: props.prepared,
        contextEnabled: props.contextEnabled,
      });
      prevPropsRef.current = props;
    }
  }, [props]);
};
```

## 🔮 Future Enhancements

Potential improvements to useChatScreenState:

- **Persistent Storage**: Save state to AsyncStorage for app restart persistence
- **State Cleanup**: Automatic cleanup of old model states
- **Compression**: Compress large message arrays for storage
- **Migration**: Handle state format changes between app versions
- **Export/Import**: Allow users to backup/restore chat history
- **Selective Persistence**: Choose which state properties to persist
- **State Validation**: Validate state integrity on load
- **Performance Monitoring**: Track state persistence performance

## 🚨 Common Issues

### Memory Leaks
- **Issue**: State accumulates for many models
- **Solution**: Implement cleanup for unused models

### State Inconsistency
- **Issue**: State gets out of sync between components
- **Solution**: Use single source of truth pattern

### Performance Issues
- **Issue**: Frequent state updates impact performance
- **Solution**: Debounce updates or use selective persistence

---

*useChatScreenState ensures smooth user experience by maintaining chat state across navigation!* 💾🔄