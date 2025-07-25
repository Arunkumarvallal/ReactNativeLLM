# useModelPreparation

The `useModelPreparation` hook manages the AI model preparation process, handling model loading, initialization, and status updates for ReactNativeLLM.

## 📋 Overview

**Location**: `src/hooks/useModelPreparation.ts`
**Purpose**: Manage model preparation lifecycle and user feedback

This hook handles the process of preparing AI models for inference, providing status updates and managing the user experience during model initialization.

## 🎯 Hook Interface

### Parameters

```typescript
interface UseModelPreparationProps {
  modelId?: string;                                            // Model to prepare
  initialPreparing?: boolean;                                  // Initial preparing state
  initialPrepared?: boolean;                                   // Initial prepared state
  onMessagesUpdate?: (updater: (prev: IMessage[]) => IMessage[]) => void; // Message update callback
}
```

### Return Value

```typescript
interface UseModelPreparationReturn {
  preparing: boolean;    // Whether model is currently preparing
  prepared: boolean;     // Whether model is ready for use
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import { useModelPreparation } from '../hooks/useModelPreparation';

const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { preparing, prepared } = useModelPreparation({
    modelId,
    onMessagesUpdate: setMessages,
  });

  if (preparing) {
    return <LoadingIndicator message="Preparing model..." />;
  }

  return (
    <CustomGiftedChat
      messages={messages}
      onSend={onSend}
      disabled={!prepared}
    />
  );
};
```

### With Initial State

```typescript
const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  
  // Get initial state from store
  const initialState = getChatScreenState(modelId);
  
  const { preparing, prepared } = useModelPreparation({
    modelId,
    initialPreparing: initialState?.preparing ?? true,
    initialPrepared: initialState?.prepared ?? false,
    onMessagesUpdate: updateMessages,
  });

  return (
    <View>
      {preparing && <PreparationIndicator />}
      <CustomGiftedChat messages={messages} onSend={onSend} />
    </View>
  );
};
```

### Integration with Chat Messages

```typescript
const ChatScreen: React.FC = ({ route }) => {
  const { modelId } = route.params;
  
  const { displayedMessages, onSend, updateMessages } = useChatMessages({
    modelId,
    // ... other props
  });

  const { preparing, prepared } = useModelPreparation({
    modelId,
    onMessagesUpdate: updateMessages,
  });

  return (
    <CustomGiftedChat
      messages={displayedMessages}
      onSend={prepared ? onSend : undefined}
      text={text}
      onInputTextChanged={setText}
    />
  );
};
```

## 🔧 Internal Implementation

### Preparation Process

```typescript
export const useModelPreparation = ({
  modelId,
  initialPreparing = true,
  initialPrepared = false,
  onMessagesUpdate,
}: UseModelPreparationProps) => {
  const [preparing, setPreparing] = useState<boolean>(initialPreparing);
  const [prepared, setPrepared] = useState<boolean>(initialPrepared);

  useEffect(() => {
    let isMounted = true;

    if (modelId && !prepared) {
      setPreparing(true);
      
      // Add preparing message
      onMessagesUpdate?.((previousMessages) => [
        {
          _id: 'preparing',
          text: 'Preparing model, please wait...',
          createdAt: new Date(),
          user: AI_BOT,
        },
        ...previousMessages,
      ]);

      prepareModel(modelId)
        .then(() => {
          if (isMounted) {
            setPreparing(false);
            setPrepared(true);
            
            // Add ready message
            onMessagesUpdate?.((previousMessages) => [
              {
                _id: 'ready',
                text: 'Model ready for conversation!',
                createdAt: new Date(),
                user: AI_BOT,
              },
              ...previousMessages,
            ]);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setPreparing(false);
            
            // Add error message
            onMessagesUpdate?.((previousMessages) => [
              {
                _id: uuid(),
                text: 'Error preparing model: ' + (error instanceof Error ? error.message : String(error)),
                createdAt: new Date(),
                user: AI_BOT,
              },
              ...previousMessages,
            ]);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [modelId, prepared]); // Note: onMessagesUpdate removed from dependencies

  return {
    preparing,
    prepared,
  };
};
```

### Status Messages

The hook automatically adds status messages to the chat:

#### Preparing Message
```typescript
{
  _id: 'preparing',
  text: 'Preparing model, please wait...',
  createdAt: new Date(),
  user: AI_BOT,
}
```

#### Ready Message
```typescript
{
  _id: 'ready',
  text: 'Model ready for conversation!',
  createdAt: new Date(),
  user: AI_BOT,
}
```

#### Error Message
```typescript
{
  _id: uuid(),
  text: 'Error preparing model: [error details]',
  createdAt: new Date(),
  user: AI_BOT,
}
```

## 🔄 Preparation Lifecycle

### States and Transitions

```
Initial State
     ↓
[preparing: true, prepared: false]
     ↓
Model Preparation (react-native-ai)
     ↓
Success → [preparing: false, prepared: true]
     ↓
Ready for Chat

OR

Error → [preparing: false, prepared: false]
     ↓
Error Display
```

### Preparation Process

1. **Initialization**: Hook detects model ID and begins preparation
2. **Status Message**: "Preparing model" message added to chat
3. **Model Loading**: `prepareModel()` called from react-native-ai
4. **Success Path**:
   - Preparation completes successfully
   - "Model ready" message added to chat
   - State updated to prepared
5. **Error Path**:
   - Preparation fails
   - Error message added to chat
   - State remains unprepared

## 🎯 User Experience Features

### Visual Feedback

The hook provides clear feedback through chat messages:

- **Preparing**: Users see a clear "preparing" message
- **Ready**: Confirmation when model is ready
- **Error**: Descriptive error messages

### State Management

- **Prevents Premature Use**: Chat is disabled until model is ready
- **Persistent State**: Preparation status persists across navigation
- **Initial State Support**: Can start with already-prepared models

### Error Handling

```typescript
.catch((error) => {
  if (isMounted) {
    setPreparing(false);
    
    // Detailed error message
    const errorText = error instanceof Error 
      ? error.message 
      : String(error);
    
    onMessagesUpdate?.((previousMessages) => [
      {
        _id: uuid(),
        text: `Error preparing model: ${errorText}`,
        createdAt: new Date(),
        user: AI_BOT,
      },
      ...previousMessages,
    ]);
  }
});
```

## 🧪 Testing

### Unit Tests

```typescript
describe('useModelPreparation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock react-native-ai
    jest.mock('react-native-ai', () => ({
      prepareModel: jest.fn(),
    }));
  });

  it('should start preparation when modelId provided', async () => {
    const onMessagesUpdate = jest.fn();
    prepareModel.mockResolvedValue(undefined);

    const { result, waitFor } = renderHook(() => 
      useModelPreparation({
        modelId: 'test-model',
        onMessagesUpdate,
      })
    );

    expect(result.current.preparing).toBe(true);
    expect(result.current.prepared).toBe(false);

    // Should add preparing message
    expect(onMessagesUpdate).toHaveBeenCalledWith(expect.any(Function));

    await waitFor(() => {
      expect(result.current.preparing).toBe(false);
      expect(result.current.prepared).toBe(true);
    });

    expect(prepareModel).toHaveBeenCalledWith('test-model');
  });

  it('should handle preparation success', async () => {
    const onMessagesUpdate = jest.fn();
    prepareModel.mockResolvedValue(undefined);

    const { result, waitFor } = renderHook(() => 
      useModelPreparation({
        modelId: 'test-model',
        onMessagesUpdate,
      })
    );

    await waitFor(() => {
      expect(result.current.prepared).toBe(true);
    });

    // Should have called onMessagesUpdate twice: preparing + ready
    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);

    // Check for ready message
    const readyCall = onMessagesUpdate.mock.calls[1][0];
    const updatedMessages = readyCall([]);
    expect(updatedMessages[0].text).toBe('Model ready for conversation!');
  });

  it('should handle preparation errors', async () => {
    const onMessagesUpdate = jest.fn();
    const mockError = new Error('Preparation failed');
    prepareModel.mockRejectedValue(mockError);

    const { result, waitFor } = renderHook(() => 
      useModelPreparation({
        modelId: 'test-model',
        onMessagesUpdate,
      })
    );

    await waitFor(() => {
      expect(result.current.preparing).toBe(false);
      expect(result.current.prepared).toBe(false);
    });

    // Should have called onMessagesUpdate twice: preparing + error
    expect(onMessagesUpdate).toHaveBeenCalledTimes(2);

    // Check for error message
    const errorCall = onMessagesUpdate.mock.calls[1][0];
    const updatedMessages = errorCall([]);
    expect(updatedMessages[0].text).toContain('Error preparing model: Preparation failed');
  });

  it('should not prepare when already prepared', () => {
    const onMessagesUpdate = jest.fn();
    
    renderHook(() => 
      useModelPreparation({
        modelId: 'test-model',
        initialPrepared: true,
        onMessagesUpdate,
      })
    );

    expect(prepareModel).not.toHaveBeenCalled();
    expect(onMessagesUpdate).not.toHaveBeenCalled();
  });

  it('should handle component unmount during preparation', async () => {
    prepareModel.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );

    const { unmount } = renderHook(() => 
      useModelPreparation({
        modelId: 'test-model',
        onMessagesUpdate: jest.fn(),
      })
    );

    // Unmount before preparation completes
    unmount();

    // Should not cause errors or memory leaks
    await new Promise(resolve => setTimeout(resolve, 1100));
  });

  it('should handle initial state correctly', () => {
    const { result } = renderHook(() => 
      useModelPreparation({
        modelId: 'test-model',
        initialPreparing: false,
        initialPrepared: true,
        onMessagesUpdate: jest.fn(),
      })
    );

    expect(result.current.preparing).toBe(false);
    expect(result.current.prepared).toBe(true);
    expect(prepareModel).not.toHaveBeenCalled();
  });
});
```

### Integration Tests

```typescript
describe('useModelPreparation Integration', () => {
  it('should integrate with chat messages hook', async () => {
    const TestComponent = ({ modelId }: { modelId: string }) => {
      const [messages, setMessages] = useState<IMessage[]>([]);
      
      const { preparing, prepared } = useModelPreparation({
        modelId,
        onMessagesUpdate: setMessages,
      });
      
      return (
        <View testID="test-component">
          <Text testID="preparing">{preparing.toString()}</Text>
          <Text testID="prepared">{prepared.toString()}</Text>
          <Text testID="message-count">{messages.length.toString()}</Text>
        </View>
      );
    };

    prepareModel.mockResolvedValue(undefined);

    const { getByTestId } = render(
      <TestComponent modelId="test-model" />
    );

    // Initially preparing
    expect(getByTestId('preparing').props.children).toBe('true');
    expect(getByTestId('prepared').props.children).toBe('false');

    // Should have preparing message
    await waitFor(() => {
      expect(getByTestId('message-count').props.children).toBe('1');
    });

    // Should complete preparation
    await waitFor(() => {
      expect(getByTestId('preparing').props.children).toBe('false');
      expect(getByTestId('prepared').props.children).toBe('true');
      expect(getByTestId('message-count').props.children).toBe('2');
    });
  });
});
```

## ⚡ Performance Considerations

### Memory Leak Prevention

```typescript
useEffect(() => {
  let isMounted = true;

  // Preparation logic

  return () => {
    isMounted = false; // Prevent state updates after unmount
  };
}, [modelId, prepared]);
```

### Dependency Management

```typescript
// onMessagesUpdate deliberately excluded from dependencies
// to prevent unnecessary re-initialization
}, [modelId, prepared]); // Only re-run when model or prepared state changes
```

### Efficient State Updates

```typescript
// Conditional preparation
if (modelId && !prepared) {
  // Only prepare if model ID exists and not already prepared
}
```

## 🔧 Advanced Usage

### Custom Preparation Messages

```typescript
const useCustomModelPreparation = (props: UseModelPreparationProps & {
  preparingMessage?: string;
  readyMessage?: string;
}) => {
  const { preparingMessage = 'Preparing model...', readyMessage = 'Model ready!' } = props;
  
  // Custom implementation with custom messages
  // ...
};
```

### Preparation with Progress

```typescript
const useModelPreparationWithProgress = (props: UseModelPreparationProps) => {
  const [progress, setProgress] = useState(0);
  
  // Enhanced implementation with progress tracking
  // ...
  
  return {
    preparing,
    prepared,
    progress,
  };
};
```

### Preparation Analytics

```typescript
const useModelPreparationWithAnalytics = (props: UseModelPreparationProps) => {
  const [preparationTime, setPreparationTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Track preparation performance
  // ...
  
  return {
    preparing,
    prepared,
    preparationTime,
  };
};
```

## 🔮 Future Enhancements

Potential improvements to useModelPreparation:

- **Progress Tracking**: Show model loading progress
- **Retry Logic**: Automatic retry on preparation failures
- **Preparation Caching**: Cache prepared models to avoid re-preparation
- **Background Preparation**: Prepare models in background
- **Preparation Queue**: Queue multiple model preparations
- **Performance Metrics**: Track preparation times and success rates
- **Custom Messages**: Configurable status messages
- **Preparation Optimization**: Optimize model loading process

## 🚨 Common Issues

### Preparation Timeouts
- **Large Models**: May take several minutes to prepare
- **Device Performance**: Older devices may be slower
- **Memory Constraints**: Insufficient RAM may cause failures

### Memory Leaks
- **Component Unmounting**: Ensure proper cleanup on unmount
- **State Updates**: Prevent updates after component unmount

### Model Loading Failures
- **Model Corruption**: Re-download corrupted models
- **Insufficient Storage**: Ensure adequate device storage
- **Memory Issues**: Close other apps to free memory

---

*useModelPreparation ensures smooth model initialization with clear user feedback!* ⚙️🤖