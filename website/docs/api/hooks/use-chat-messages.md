# useChatMessages

The `useChatMessages` hook manages chat message state, AI integration, and context-aware conversations. It's the core hook for handling all chat functionality.

## 📋 Overview

**Location**: `src/hooks/useChatMessages.ts`
**Purpose**: Centralized chat message management with AI model integration

This hook encapsulates all chat-related logic including message state, AI model communication, context integration, and error handling.

## 🎯 Hook Interface

### Parameters

```typescript
interface UseChatMessagesProps {
  modelId: string;                                         // Active AI model ID
  initialMessages?: IMessage[];                            // Initial message history
  getContextForQuery?: (query: string) => Promise<string | null>; // Context retrieval function
  contextEnabled?: boolean;                                // Whether context is enabled
  contextAvailable?: boolean;                              // Whether context is available
}
```

### Return Value

```typescript
interface UseChatMessagesReturn {
  displayedMessages: IMessage[];                          // Current message list
  text: string;                                           // Input field text
  setText: (text: string) => void;                       // Update input text
  onSend: (messages: IMessage[]) => void;                // Send message handler
  updateMessages: (updater: IMessage[] | ((prev: IMessage[]) => IMessage[])) => void; // Update messages
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import { useChatMessages } from '../hooks/useChatMessages';

const ChatScreen: React.FC = () => {
  const {
    displayedMessages,
    text,
    setText,
    onSend,
  } = useChatMessages({
    modelId: 'llama-2-7b',
  });

  return (
    <GiftedChat
      messages={displayedMessages}
      onSend={onSend}
      text={text}
      onInputTextChanged={setText}
      user={USER}
    />
  );
};
```

### With Context Integration

```typescript
const ChatScreen: React.FC = () => {
  const { getContextForQuery } = useContextManager();
  
  const {
    displayedMessages,
    text,
    setText,
    onSend,
  } = useChatMessages({
    modelId: 'llama-2-7b',
    getContextForQuery,
    contextEnabled: true,
    contextAvailable: true,
  });

  // ... render chat interface
};
```

### With Persistent Messages

```typescript
const ChatScreen: React.FC = () => {
  const initialState = getChatScreenState(modelId);
  
  const {
    displayedMessages,
    text,
    setText,
    onSend,
    updateMessages,
  } = useChatMessages({
    modelId,
    initialMessages: initialState?.messages || [],
    getContextForQuery,
    contextEnabled,
    contextAvailable,
  });

  // Messages automatically persist through updateMessages
};
```

## 🔧 Internal Implementation

### Message State Management

```typescript
const [displayedMessages, setDisplayedMessages] = useState<IMessage[]>(initialMessages);
const [text, setText] = useState<string>('');

const updateMessages = useCallback((updater: IMessage[] | ((prev: IMessage[]) => IMessage[])) => {
  if (typeof updater === 'function') {
    setDisplayedMessages(updater);
  } else {
    setDisplayedMessages(updater);
  }
}, []);
```

### AI Message Processing

```typescript
const sendMessage = useCallback(
  async (userMessage: IMessage, currentMessages: IMessage[]) => {
    if (!modelId) return;

    try {
      const userQuery = userMessage.text || '';
      
      // Get context if enabled and available
      let contextContent = null;
      if (contextEnabled && contextAvailable && getContextForQuery) {
        contextContent = await getContextForQuery(userQuery);
      }
      
      // Prepare message history
      const messageHistory = currentMessages
        .reverse()
        .map((message: IMessage): CoreMessage => ({
          content: message.text,
          role: message.user._id === 2 ? 'assistant' : 'user',
        }));

      // Enhance current message with context
      let currentUserContent = userQuery;
      if (contextContent) {
        currentUserContent = `${contextContent}\n\nUser Question: ${userQuery}`;
      }
      
      // Build final message array
      const enhancedMessageHistory: CoreMessage[] = [
        ...messageHistory,
        {
          content: currentUserContent,
          role: 'user' as const
        }
      ];
      
      // Generate AI response
      const { text } = await generateText({
        model: getModel(modelId) as any,
        ...LLM_GENERATION_CONFIG,
        messages: enhancedMessageHistory,
      });
      
      // Add AI response to messages
      const aiMessage: IMessage = {
        _id: uuid(),
        text: text,
        createdAt: new Date(),
        user: AI_BOT,
      };

      updateMessages(prev => [aiMessage, ...prev]);
    } catch (error) {
      // Handle errors with error messages
      const errorMessage: IMessage = {
        _id: uuid(),
        text: 'Error: ' + (error instanceof Error ? error.message : String(error)),
        createdAt: new Date(),
        user: AI_BOT,
      };
      updateMessages(prev => [errorMessage, ...prev]);
    }
  },
  [modelId, contextEnabled, contextAvailable, getContextForQuery, updateMessages]
);
```

## 🎯 Message Flow

### Send Message Process

1. **User Input**: User types message and presses send
2. **Message Creation**: User message is created with unique ID
3. **Immediate Display**: User message appears in chat immediately  
4. **Context Retrieval**: If enabled, relevant context is retrieved
5. **Message Enhancement**: Context is added to user query
6. **AI Processing**: Enhanced message sent to AI model
7. **Response Display**: AI response appears in chat
8. **Error Handling**: Errors are displayed as AI messages

### Message Structure

```typescript
// User message
const userMessage: IMessage = {
  _id: uuid(),
  text: userInput,
  createdAt: new Date(),
  user: USER, // { _id: 1, name: 'You', avatar: 'user' }
};

// AI response message
const aiMessage: IMessage = {
  _id: uuid(),
  text: aiResponse,
  createdAt: new Date(),
  user: AI_BOT, // { _id: 2, name: 'AI Chat Bot' }
};

// Error message
const errorMessage: IMessage = {
  _id: uuid(),
  text: 'Error: Connection failed',
  createdAt: new Date(),
  user: AI_BOT,
};
```

## 🧠 Context Integration

### Context-Aware Processing

```typescript
// Check if context should be included
if (contextEnabled && contextAvailable && getContextForQuery) {
  console.log('🔍 Context enabled - getting context for query');
  contextContent = await getContextForQuery(userQuery);
} else {
  console.log('❌ Context disabled or unavailable');
}

// Enhance user message with context
if (contextContent) {
  console.log('🚀 Adding context to user message - Length:', contextContent.length);
  currentUserContent = `${contextContent}\n\nUser Question: ${userQuery}`;
}
```

### Context State Logging

The hook provides detailed logging for context operations:

```typescript
console.log('🔄 Current context state - enabled:', contextEnabled, 'available:', contextAvailable);
console.log('📝 Final messages being sent to LLM:', 
  enhancedMessageHistory.map(m => ({ role: m.role, contentLength: m.content.length }))
);
```

## ⚡ Performance Optimizations

### Memoized Callbacks

```typescript
const updateMessages = useCallback((updater) => {
  // Memoized to prevent unnecessary re-renders
}, []);

const sendMessage = useCallback(async (userMessage, currentMessages) => {
  // Dependencies carefully managed
}, [modelId, contextEnabled, contextAvailable, getContextForQuery, updateMessages]);
```

### Efficient Message Updates

```typescript
// Efficient message prepending (newer messages first)
updateMessages(prev => [newMessage, ...prev]);

// Batch updates to prevent multiple re-renders
updateMessages(prev => {
  const newMessages = [userMessage, ...prev];
  sendMessage(userMessage, prev); // Async processing
  return newMessages;
});
```

## 🚨 Error Handling

### AI Model Errors

```typescript
catch (error) {
  const errorMessage: IMessage = {
    _id: uuid(),
    text: 'Error: ' + (error instanceof Error ? error.message : String(error)),
    createdAt: new Date(),
    user: AI_BOT,
  };
  updateMessages(prev => [errorMessage, ...prev]);
}
```

### Context Errors

Context errors are handled gracefully without breaking the chat flow:

```typescript
try {
  contextContent = await getContextForQuery(userQuery);
} catch (contextError) {
  console.warn('Context retrieval failed:', contextError);
  // Continue without context
  contextContent = null;
}
```

### Model Availability

```typescript
const sendMessage = useCallback(async (userMessage, currentMessages) => {
  if (!modelId) {
    console.warn('No model ID provided');
    return;
  }
  
  // ... rest of processing
}, [modelId, /* other deps */]);
```

## 🎨 Message Customization

### Custom Message Types

```typescript
// System messages for model preparation
const preparingMessage: IMessage = {
  _id: 'preparing',
  text: 'Preparing model, please wait...',
  createdAt: new Date(),
  user: AI_BOT,
};

// Success messages
const readyMessage: IMessage = {
  _id: 'ready',
  text: 'Model ready for conversation!',
  createdAt: new Date(),
  user: AI_BOT,
};
```

### Message Metadata

```typescript
// Messages can include additional metadata
const messageWithMetadata: IMessage = {
  _id: uuid(),
  text: aiResponse,
  createdAt: new Date(),
  user: AI_BOT,
  // Custom metadata
  metadata: {
    contextUsed: !!contextContent,
    processingTime: endTime - startTime,
    modelVersion: modelId,
  },
};
```

## 🧪 Testing

### Mock Setup

```typescript
// Mock the hook dependencies
const mockGetContextForQuery = jest.fn();
const mockGenerateText = jest.fn();

jest.mock('react-native-ai', () => ({
  getModel: jest.fn(),
  generateText: mockGenerateText,
}));
```

### Test Cases

```typescript
describe('useChatMessages', () => {
  it('should send message without context', async () => {
    const { result } = renderHook(() => useChatMessages({
      modelId: 'test-model',
      contextEnabled: false,
    }));
    
    await act(async () => {
      result.current.onSend([testMessage]);
    });
    
    expect(result.current.displayedMessages).toHaveLength(2); // User + AI
  });

  it('should include context when enabled', async () => {
    mockGetContextForQuery.mockResolvedValue('test context');
    
    const { result } = renderHook(() => useChatMessages({
      modelId: 'test-model',
      contextEnabled: true,
      contextAvailable: true,
      getContextForQuery: mockGetContextForQuery,
    }));
    
    await act(async () => {
      result.current.onSend([testMessage]);
    });
    
    expect(mockGetContextForQuery).toHaveBeenCalledWith('test message');
  });

  it('should handle errors gracefully', async () => {
    mockGenerateText.mockRejectedValue(new Error('AI Error'));
    
    const { result } = renderHook(() => useChatMessages({
      modelId: 'test-model',
    }));
    
    await act(async () => {
      result.current.onSend([testMessage]);
    });
    
    const lastMessage = result.current.displayedMessages[0];
    expect(lastMessage.text).toContain('Error: AI Error');
  });
});
```

## 🔮 Future Enhancements

Planned improvements to the useChatMessages hook:

- **Message Threading**: Support for conversation branching
- **Message Reactions**: Like/dislike AI responses
- **Streaming Responses**: Real-time AI response streaming
- **Message Editing**: Edit and resend messages
- **Conversation Summarization**: Summarize long conversations
- **Export Options**: Export conversations to various formats

## 🚨 Common Issues

### Memory Leaks
- **Cleanup**: Ensure proper cleanup of async operations
- **Dependencies**: Carefully manage useCallback dependencies

### Performance Issues
- **Large Conversations**: Consider message pagination
- **Frequent Updates**: Optimize re-render frequency

### Context Issues
- **Async Context**: Handle async context retrieval properly
- **Context Errors**: Graceful fallback when context fails

---

*The useChatMessages hook provides powerful and flexible chat functionality with AI integration!* 💬🤖