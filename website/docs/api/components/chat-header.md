# ChatHeader

The `ChatHeader` component provides the navigation and control interface for the chat screen, including model information, context controls, theme switching, and navigation.

## 📋 Overview

**Location**: `src/components/ChatHeader.tsx`
**Purpose**: Header component for chat screen with integrated controls

The ChatHeader serves as the primary control interface for chat functionality, combining navigation, context management, and theme controls in a unified header.

## 🎯 Props Interface

```typescript
interface ChatHeaderProps {
  modelId: string;                                    // Currently active model ID
  contextEnabled: boolean;                            // Whether context is enabled
  contextAvailable: boolean;                          // Whether context file is available
  onContextToggle: (enabled: boolean) => void;        // Context toggle handler
  onCreateTestContext: () => void;                    // Test context creation handler
  onRefreshContext: () => void;                       // Context refresh handler  
  onBack: () => void;                                 // Back navigation handler
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import ChatHeader from '../components/ChatHeader';

const ChatScreen: React.FC = () => {
  const [contextEnabled, setContextEnabled] = useState(true);
  const [contextAvailable, setContextAvailable] = useState(false);
  
  return (
    <SafeAreaView>
      <ChatHeader
        modelId="llama-2-7b"
        contextEnabled={contextEnabled}
        contextAvailable={contextAvailable}
        onContextToggle={setContextEnabled}
        onCreateTestContext={handleCreateTestContext}
        onRefreshContext={handleRefreshContext}
        onBack={() => navigation.goBack()}
      />
      {/* Chat content */}
    </SafeAreaView>
  );
};
```

### With Navigation Integration

```typescript
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { modelId } = route.params;
  
  return (
    <SafeAreaView>
      <ChatHeader
        modelId={modelId}
        contextEnabled={contextEnabled}
        contextAvailable={contextAvailable}
        onContextToggle={setContextEnabled}
        onCreateTestContext={createTestContext}
        onRefreshContext={refreshContext}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};
```

## 🎨 Component Structure

### Header Layout

```typescript
<View style={styles.topRow}>
  {/* Back Button */}
  <TouchableOpacity onPress={onBack}>
    <ArrowLeftIcon size={22} color={theme.text} weight="bold" />
  </TouchableOpacity>
  
  {/* Model Title */}
  <Text style={[styles.title, { color: theme.text }]}>
    {modelId}
  </Text>
  
  {/* Context Toggle */}
  <ContextToggleButton 
    enabled={contextEnabled} 
    onToggle={onContextToggle}
    available={contextAvailable}
    onLongPress={onCreateTestContext}
  />
  
  {/* Context Refresh (conditional) */}
  {contextAvailable && (
    <TouchableOpacity onPress={onRefreshContext}>
      <ArrowClockwise size={20} color={theme.placeholder} weight="bold" />
    </TouchableOpacity>
  )}
  
  {/* Theme Toggle */}
  <ThemeToggleButton />
</View>
```

## 🎛️ Controls

### Back Navigation
- **Icon**: Arrow left icon
- **Behavior**: Calls `onBack` prop function
- **Styling**: Themed with current color scheme

### Model Title
- **Content**: Displays the current `modelId`
- **Styling**: Bold text with theme colors
- **Behavior**: Text truncation with ellipsis for long model names

### Context Toggle
- **Component**: `ContextToggleButton`
- **States**: Enabled/disabled, available/unavailable
- **Interactions**: 
  - **Tap**: Toggle context on/off (when available)
  - **Long Press**: Create test context (when unavailable)

### Context Refresh
- **Visibility**: Only shown when `contextAvailable` is true
- **Icon**: Clockwise arrow (refresh icon)
- **Behavior**: Manually refreshes context from file
- **Accessibility**: Labeled for screen readers

### Theme Toggle
- **Component**: `ThemeToggleButton`
- **Behavior**: Switches between light/dark themes
- **Position**: Rightmost element in header

## 🎨 Styling

### Layout Styles

```typescript
const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',    // Right-align controls
    padding: 8,
    backgroundColor: 'transparent',
    gap: 8,                        // Consistent spacing
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,                       // Take available space
  },
  contextButton: {
    marginRight: 4,
  },
  refreshButton: {
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
    marginRight: 4,
  },
  themeButton: {
    marginLeft: 8,
  },
});
```

### Theme Integration

All colors are dynamically applied based on the current theme:

```typescript
const { theme } = useTheme();

// Icon colors
<ArrowLeftIcon color={theme.text} />
<ArrowClockwise color={theme.placeholder} />

// Text colors  
<Text style={{ color: theme.text }}>
```

## ♿ Accessibility

### Screen Reader Support

```typescript
<TouchableOpacity
  onPress={onRefreshContext}
  accessibilityLabel="Refresh context"
  accessibilityHint="Manually refresh context from file"
>
```

### Accessibility Labels
- **Back Button**: "Navigate back"
- **Context Toggle**: Dynamic based on state
- **Refresh Button**: "Refresh context"
- **Theme Toggle**: "Toggle theme"

### Focus Management
- Proper tab order for keyboard navigation
- Visual focus indicators
- Appropriate touch targets (minimum 44x44 points)

## 🎯 Behavior

### Conditional Rendering

The refresh button only appears when context is available:

```typescript
{contextAvailable && (
  <TouchableOpacity onPress={onRefreshContext}>
    <ArrowClockwise size={20} color={theme.placeholder} weight="bold" />
  </TouchableOpacity>
)}
```

### Text Truncation

Long model names are truncated elegantly:

```typescript
<Text 
  style={[styles.title, { color: theme.text }]} 
  numberOfLines={1} 
  ellipsizeMode="tail"
>
  {modelId}
</Text>
```

### Responsive Layout

The header adapts to different screen sizes:
- **Flex Layout**: Title takes available space
- **Fixed Controls**: Buttons maintain consistent size
- **Spacing**: Consistent gaps between elements

## 🔧 Event Handling

### Back Navigation

```typescript
const handleBack = () => {
  // Optional: Save chat state before navigation
  saveChatState();
  navigation.goBack();
};
```

### Context Operations

```typescript
const handleContextToggle = (enabled: boolean) => {
  setContextEnabled(enabled);
  // Optional: Analytics or logging
  logContextToggle(enabled);
};

const handleRefreshContext = async () => {
  setIsRefreshing(true);
  await contextManager.forceRefresh();
  setContextAvailable(contextManager.isContextAvailable());
  setIsRefreshing(false);
};
```

## 📱 Platform Considerations

### iOS
- **Safe Area**: Header accounts for notch and status bar
- **Navigation**: Integrates with iOS navigation patterns
- **Haptics**: Could add haptic feedback on button presses

### Android
- **Status Bar**: Proper status bar handling
- **Back Button**: Handles Android hardware back button
- **Material Design**: Icons and spacing follow Material guidelines

## 🧪 Testing

### Unit Tests

```typescript
describe('ChatHeader', () => {
  it('should display model ID', () => {
    const { getByText } = render(
      <ChatHeader 
        modelId="test-model"
        contextEnabled={false}
        contextAvailable={false}
        onContextToggle={() => {}}
        onCreateTestContext={() => {}}
        onRefreshContext={() => {}}
        onBack={() => {}}
      />
    );
    
    expect(getByText('test-model')).toBeTruthy();
  });

  it('should call onBack when back button pressed', () => {
    const onBack = jest.fn();
    const { getByRole } = render(
      <ChatHeader onBack={onBack} /* other props */ />
    );
    
    fireEvent.press(getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalled();
  });

  it('should show refresh button when context available', () => {
    const { getByLabelText } = render(
      <ChatHeader contextAvailable={true} /* other props */ />
    );
    
    expect(getByLabelText('Refresh context')).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
describe('ChatHeader Integration', () => {
  it('should integrate with theme context', () => {
    // Test theme switching affects header colors
  });
  
  it('should integrate with navigation', () => {
    // Test navigation behavior
  });
});
```

## 🔮 Future Enhancements

Potential improvements to the ChatHeader:

- **Model Switching**: Quick model selector in header
- **Connection Status**: Network status indicator
- **Chat Actions**: Export, share, or clear chat options
- **Voice Controls**: Voice activation for context toggle
- **Custom Actions**: Extensible action buttons

## 🚨 Common Issues

### Layout Issues
- **Text Overflow**: Use `numberOfLines` and `ellipsizeMode`
- **Button Spacing**: Ensure consistent gaps between controls
- **Safe Area**: Test on devices with notches

### Theme Issues
- **Color Contrast**: Ensure sufficient contrast in both themes
- **Icon Visibility**: Test icon visibility in both light and dark modes

### Performance
- **Re-renders**: Optimize with `React.memo` if necessary
- **Animation**: Keep animations smooth on older devices

---

*The ChatHeader provides an intuitive and powerful control interface for chat interactions!* 📱🎛️