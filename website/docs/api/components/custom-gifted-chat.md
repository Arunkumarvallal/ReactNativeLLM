# CustomGiftedChat

The `CustomGiftedChat` component is a customized implementation of react-native-gifted-chat, specifically tailored for AI conversations in ReactNativeLLM.

## 📋 Overview

**Location**: `src/components/CustomGiftedChat.tsx`
**Purpose**: Provide a themed, customizable chat interface for AI interactions

This component wraps react-native-gifted-chat with custom styling, avatars, and theme integration optimized for AI model conversations.

## 🎯 Props Interface

```typescript
interface CustomGiftedChatProps {
  messages: IMessage[];                          // Array of chat messages
  onSend: (messages: IMessage[]) => void;       // Callback when user sends message
  text: string;                                 // Current input text
  onInputTextChanged: (text: string) => void;   // Input text change handler
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import CustomGiftedChat from '../components/CustomGiftedChat';
import { useChatMessages } from '../hooks/useChatMessages';

const ChatScreen: React.FC = () => {
  const {
    displayedMessages,
    text,
    setText,
    onSend,
  } = useChatMessages({ modelId: 'llama-2-7b' });

  return (
    <CustomGiftedChat
      messages={displayedMessages}
      onSend={onSend}
      text={text}
      onInputTextChanged={setText}
    />
  );
};
```

### With Theme Integration

```typescript
const ChatScreen: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={{ backgroundColor: theme.background }}>
      <CustomGiftedChat
        messages={messages}
        onSend={onSend}
        text={text}
        onInputTextChanged={setText}
      />
    </SafeAreaView>
  );
};
```

## 🎨 Custom Renderers

### Bubble Renderer

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

**Features**:
- Theme-aware bubble colors
- Consistent text styling
- Proper left/right alignment

### Input Toolbar Renderer

```typescript
const renderInputToolbar = (props: any) => (
  <InputToolbar
    {...props}
    containerStyle={{ backgroundColor: theme.inputBackground }}
  />
);
```

**Features**:
- Theme-integrated background
- Consistent with app styling

### Composer Renderer

```typescript
const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={{ color: theme.text, fontSize: 14 }}
    placeholderTextColor={theme.placeholder}
  />
);
```

**Features**:
- Theme-aware text colors
- Consistent placeholder styling
- Proper font sizing

### Avatar Renderer

```typescript
const renderAvatar = (props: any) => {
  const { currentMessage } = props;
  
  if (currentMessage?.user?._id === USER._id) {
    // User avatar
    return (
      <View style={userAvatarStyle}>
        <UserIcon size={24} color={theme.downloadIcon} weight="fill" />
      </View>
    );
  } else if (currentMessage?.user?._id === 2) {
    // AI bot avatar
    return (
      <View style={botAvatarStyle}>
        <RobotIcon size={24} color={theme.downloadIcon} weight="fill" />
      </View>
    );
  }
  return null;
};
```

**Features**:
- Custom user and AI avatars
- Theme-integrated icon colors
- Consistent sizing and styling

## 👤 Avatar System

### User Avatar Design

```typescript
const userAvatarStyle = {
  width: AVATAR_SIZE, 
  height: AVATAR_SIZE, 
  borderRadius: AVATAR_RADIUS, 
  backgroundColor: theme.secondaryBackground, 
  alignItems: 'center', 
  justifyContent: 'center', 
  overflow: 'hidden', 
  marginRight: 4
};
```

### AI Bot Avatar Design

```typescript
const botAvatarStyle = { 
  width: AVATAR_SIZE, 
  height: AVATAR_SIZE, 
  borderRadius: AVATAR_RADIUS, 
  overflow: 'hidden', 
  marginRight: 4 
};
```

### Avatar Configuration

- **Size**: 36x36 pixels (configurable via `AVATAR_SIZE` constant)
- **Shape**: Circular with 18px radius
- **Icons**: Phosphor React Native icons
- **Positioning**: Top-aligned with messages
- **Visibility**: Shown for every message

## 🎨 Theme Integration

### Dynamic Styling

The component automatically adapts to the current theme:

```typescript
const { theme } = useTheme();

// Message bubbles
wrapperStyle={{
  left: { backgroundColor: theme.bubbleLeft },    // AI messages
  right: { backgroundColor: theme.bubbleRight },  // User messages
}}

// Text colors
textStyle={{
  left: { color: theme.text },   // AI text
  right: { color: theme.text },  // User text
}}

// Input styling
textInputStyle={{ color: theme.text }}
placeholderTextColor={theme.placeholder}

// Container background
messagesContainerStyle={{ backgroundColor: theme.background }}
```

### Theme Properties Used

- `theme.bubbleLeft`: AI message background
- `theme.bubbleRight`: User message background  
- `theme.text`: Text color for messages
- `theme.placeholder`: Placeholder text color
- `theme.inputBackground`: Input field background
- `theme.background`: Main container background
- `theme.downloadIcon`: Avatar icon color

## ⚡ Performance Features

### Optimized Rendering

```typescript
<GiftedChat
  messages={messages}
  showAvatarForEveryMessage={true}
  renderAvatarOnTop={true}
  messagesContainerStyle={{ backgroundColor: theme.background }}
  // Performance optimizations built into GiftedChat
/>
```

### Built-in Optimizations

- **Virtual Scrolling**: Only renders visible messages
- **Message Recycling**: Reuses message components
- **Lazy Loading**: Loads messages as needed
- **Memory Management**: Automatic cleanup of old messages

## 🔧 Configuration Options

### Message Display Options

```typescript
// Show avatars for every message
showAvatarForEveryMessage={true}

// Position avatars at top of messages
renderAvatarOnTop={true}

// Custom user configuration
user={{ ...USER, avatar: '' }}  // Empty avatar since we use custom renderer
```

### Input Configuration

```typescript
// Current text value
text={text}

// Text change handler
onInputTextChanged={onInputTextChanged}

// Send handler
onSend={onSend}
```

## ♿ Accessibility

### Screen Reader Support

- **Message Content**: Automatically accessible via GiftedChat
- **Input Field**: Proper labeling and hints
- **Send Button**: Clear action labeling
- **Avatars**: Decorative elements, properly marked

### Navigation Support

- **Tab Order**: Logical focus flow
- **Touch Targets**: Adequate sizes for all interactive elements
- **Voice Control**: Compatible with voice commands

## 🧪 Testing

### Component Testing

```typescript
describe('CustomGiftedChat', () => {
  const mockMessages = [
    {
      _id: '1',
      text: 'Hello',
      createdAt: new Date(),
      user: USER,
    },
    {
      _id: '2',
      text: 'Hi there!',
      createdAt: new Date(),
      user: AI_BOT,
    },
  ];

  it('should render messages correctly', () => {
    const { getByText } = render(
      <CustomGiftedChat
        messages={mockMessages}
        onSend={() => {}}
        text=""
        onInputTextChanged={() => {}}
      />
    );
    
    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('Hi there!')).toBeTruthy();
  });

  it('should handle send action', () => {
    const onSend = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomGiftedChat
        messages={[]}
        onSend={onSend}
        text="Test message"
        onInputTextChanged={() => {}}
      />
    );
    
    // Simulate send action
    fireEvent.press(getByTestId('send-button'));
    expect(onSend).toHaveBeenCalled();
  });
});
```

### Integration Testing

```typescript
describe('CustomGiftedChat Integration', () => {
  it('should integrate with theme context', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <CustomGiftedChat
          messages={mockMessages}
          onSend={() => {}}
          text=""
          onInputTextChanged={() => {}}
        />
      </ThemeProvider>
    );
    
    // Test theme integration
    const container = getByTestId('chat-container');
    expect(container).toHaveStyle({ backgroundColor: expect.any(String) });
  });
});
```

## 📱 Platform Adaptations

### iOS Specific Features

- **Keyboard Handling**: Smooth keyboard animations
- **Safe Area**: Proper safe area handling
- **Haptic Feedback**: Optional haptic feedback on send
- **Scroll Behavior**: iOS-style momentum scrolling

### Android Specific Features

- **Material Design**: Android-appropriate styling
- **Keyboard**: Android keyboard integration
- **Navigation**: Hardware back button support
- **Ripple Effects**: Touch feedback on interactive elements

## 🔮 Future Enhancements

Potential improvements to CustomGiftedChat:

- **Message Actions**: Copy, share, react to messages
- **Rich Content**: Support for images, files, code blocks
- **Typing Indicators**: Show when AI is processing
- **Message Status**: Delivery and read indicators
- **Voice Messages**: Audio message support
- **Message Search**: Search through conversation history
- **Export Options**: Save conversations to files
- **Custom Themes**: More detailed theme customization

## 🚨 Common Issues

### Theme Not Applying
- **Check Theme Provider**: Ensure component is wrapped in ThemeProvider
- **Verify Theme Hook**: Make sure `useTheme()` is being called

### Avatar Issues
- **Icon Loading**: Verify Phosphor React Native is properly installed
- **Size Consistency**: Check AVATAR_SIZE and AVATAR_RADIUS constants

### Performance Issues
- **Large Message Lists**: Consider message pagination for very long conversations
- **Memory Usage**: Monitor memory usage with large conversations

---

*CustomGiftedChat provides a beautiful, themed chat experience optimized for AI conversations!* 💬🎨