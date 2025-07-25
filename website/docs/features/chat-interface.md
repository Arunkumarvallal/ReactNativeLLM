# Chat Interface

Explore the powerful and intuitive chat interface that makes conversations with AI models seamless and enjoyable.

## 💬 Interface Overview

The chat interface is built on React Native Gifted Chat, customized for AI interactions with local models.

### Main Components

- **Message Area**: Scrollable conversation history
- **Input Field**: Text input with send functionality
- **Header Controls**: Model info, context controls, theme toggle
- **Avatars**: Visual distinction between user and AI messages

## 🎨 Visual Design

### Message Styling

#### User Messages
- **Alignment**: Right-aligned (sent messages)
- **Color**: Theme-based bubble color (green in default theme)
- **Avatar**: User icon with themed background

#### AI Messages  
- **Alignment**: Left-aligned (received messages)
- **Color**: Secondary background color
- **Avatar**: Robot icon indicating AI responses

### Theme Integration

The chat interface fully supports light and dark themes:

```typescript
const renderBubble = (props: any) => (
  <Bubble
    {...props}
    wrapperStyle={{
      left: { backgroundColor: theme.bubbleLeft },
      right: { backgroundColor: theme.bubbleRight },
    }}
    textStyle={{
      left: { color: theme.text, fontSize: 14 },
      right: { color: theme.text, fontSize: 14 },
    }}
  />
);
```

## 🔤 Text Input System

### Input Features

- **Multi-line Support**: Automatic text wrapping
- **Theme-Aware**: Input styling matches current theme
- **Placeholder Text**: Contextual hints for user input
- **Send Button**: Integrated send functionality

### Input Handling

```typescript
const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={{ color: theme.text, fontSize: 14 }}
    placeholderTextColor={theme.placeholder}
  />
);
```

### Auto-Focus Behavior

- Input automatically focuses when chat screen loads
- Focus maintained during model preparation
- Smooth keyboard handling on both platforms

## 👤 Avatar System

### User Avatar
```typescript
<View style={{
  width: AVATAR_SIZE, 
  height: AVATAR_SIZE, 
  borderRadius: AVATAR_RADIUS, 
  backgroundColor: theme.secondaryBackground,
}}>
  <UserIcon size={24} color={theme.downloadIcon} weight="fill" />
</View>
```

### AI Avatar
```typescript
<View style={{ 
  width: AVATAR_SIZE, 
  height: AVATAR_SIZE, 
  borderRadius: AVATAR_RADIUS,
}}>
  <RobotIcon size={24} color={theme.downloadIcon} weight="fill" />
</View>
```

### Avatar Configuration
- **Size**: 36x36 pixels (configurable via constants)
- **Shape**: Rounded (18px radius)
- **Positioning**: Top-aligned with messages
- **Visibility**: Shown for every message

## 📝 Message Management

### Message Structure

Each message follows the Gifted Chat `IMessage` interface:

```typescript
interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: string | number;
    name?: string;
    avatar?: string;
  };
}
```

### Message Types

#### User Messages
```typescript
const userMessage: IMessage = {
  _id: uuid(),
  text: userInput,
  createdAt: new Date(),
  user: USER, // { _id: 1, name: 'You', avatar: 'user' }
};
```

#### AI Messages
```typescript
const aiMessage: IMessage = {
  _id: uuid(),
  text: aiResponse,
  createdAt: new Date(),  
  user: AI_BOT, // { _id: 2, name: 'AI Chat Bot' }
};
```

#### System Messages
```typescript
// Model preparation
{
  _id: 'preparing',
  text: 'Preparing model, please wait...',
  createdAt: new Date(),
  user: AI_BOT,
}

// Model ready
{
  _id: 'ready',
  text: 'Model ready for conversation!', 
  createdAt: new Date(),
  user: AI_BOT,
}
```

## 🔄 Real-Time Updates

### Message Flow

1. **User Input**: User types and sends message
2. **Immediate Display**: User message appears instantly
3. **AI Processing**: Model processes input (with context if enabled)
4. **Response Display**: AI response appears when complete
5. **State Persistence**: Message history is saved

### State Management

Messages are managed through the `useChatMessages` hook:

```typescript
const {
  displayedMessages,    // Current message list
  text,                // Input field text
  setText,            // Update input text
  onSend,             // Send message handler
  updateMessages,     // Update message list
} = useChatMessages({
  modelId,
  initialMessages,
  getContextForQuery,
  contextEnabled,
  contextAvailable,
});
```

## ⚡ Performance Optimizations

### Efficient Rendering

- **Virtual List**: Only visible messages are rendered
- **Message Recycling**: Message components are reused
- **Image Optimization**: Avatar icons are optimized
- **Smooth Scrolling**: Hardware-accelerated scrolling

### Memory Management

- **Message Limiting**: Very long conversations may be truncated
- **Image Caching**: Avatar images are cached
- **Component Cleanup**: Proper cleanup on screen unmount

### Loading States

The interface handles various loading states:

- **Model Preparation**: Shows preparation message
- **AI Thinking**: Could show typing indicators (future feature)
- **Context Processing**: Transparent to user

## 🎯 User Experience Features

### Accessibility

- **Screen Reader Support**: Proper accessibility labels
- **Voice Control**: Compatible with voice input
- **Dynamic Type**: Respects system font sizes
- **High Contrast**: Theme support for accessibility

### Keyboard Handling

- **Auto-Dismiss**: Keyboard dismisses when scrolling messages
- **Input Focus**: Proper focus management
- **Send on Return**: Option for return key behavior
- **Multiline Input**: Support for longer messages

### Error Handling

The interface gracefully handles errors:

```typescript
// Error messages appear as AI responses
const errorMessage: IMessage = {
  _id: uuid(),
  text: 'Error: ' + errorDetails,
  createdAt: new Date(),
  user: AI_BOT,
};
```

## 🎨 Customization Options

### Theme Customization

Modify chat appearance through theme variables:

```typescript
// In theme.ts
export const customTheme = {
  // Message bubbles
  bubbleLeft: '#F0F0F0',
  bubbleRight: '#007AFF',
  
  // Text colors
  text: '#000000',
  placeholder: '#888888',
  
  // Input styling
  inputBackground: '#FFFFFF',
};
```

### Layout Customization

Adjust layout constants:

```typescript
// In constants.ts
export const AVATAR_SIZE = 40;        // Larger avatars
export const AVATAR_RADIUS = 20;      // Maintain circular shape
```

### Message Styling

Customize message appearance:

```typescript
const customBubbleStyle = {
  // Custom bubble styling
  borderRadius: 12,
  marginVertical: 4,
  maxWidth: '80%',
};
```

## 📱 Platform-Specific Features

### iOS
- **Haptic Feedback**: Subtle feedback on message send
- **Native Scrolling**: iOS-style momentum scrolling
- **Safe Area**: Proper safe area handling

### Android
- **Material Design**: Android-appropriate styling
- **Ripple Effects**: Touch feedback on interactive elements
- **Navigation**: Android back button handling

## 🔍 Advanced Features

### Message Search (Future)
```typescript
// Planned feature
const searchMessages = (query: string) => {
  return messages.filter(msg => 
    msg.text.toLowerCase().includes(query.toLowerCase())
  );
};
```

### Message Actions (Future)
- **Copy Message**: Copy AI responses
- **Share Message**: Share conversations
- **Delete Message**: Remove messages from history

### Rich Content Support (Future)
- **Code Highlighting**: Syntax highlighting for code blocks
- **Markdown Rendering**: Rich text formatting
- **Image Support**: Image sharing capabilities

## 🐛 Troubleshooting

### Common Issues

#### Messages Not Appearing
- **Check Model Status**: Ensure model is prepared
- **Verify Input**: Check that message text is not empty
- **Restart App**: Clear any stuck states

#### Slow Scrolling
- **Large History**: Long conversations may impact performance
- **Memory Usage**: Restart app to clear memory
- **Device Performance**: Older devices may be slower

#### Input Issues
- **Keyboard Problems**: Restart app if keyboard is stuck
- **Text Not Showing**: Check theme text color contrast
- **Send Button**: Verify message text is entered

### Debug Information

Enable debug logging for troubleshooting:

```typescript
console.log('Message count:', displayedMessages.length);
console.log('Current input:', text);
console.log('Context enabled:', contextEnabled);
```

## 🔮 Future Enhancements

Planned improvements to the chat interface:

- **Typing Indicators**: Show when AI is processing
- **Message Reactions**: React to AI responses
- **Voice Input**: Speech-to-text integration
- **Message Threading**: Organize related conversations
- **Export Options**: Save conversations to files
- **Rich Media**: Support for images and files

---

*The chat interface provides an intuitive and powerful way to interact with AI models!* 💬🤖