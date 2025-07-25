# ContextToggleButton

The `ContextToggleButton` component provides a toggle interface for enabling and disabling the context system in ReactNativeLLM.

## 📋 Overview

**Location**: `src/components/ContextToggleButton.tsx`
**Purpose**: Toggle context functionality on/off with visual feedback

This component serves as the primary control for the context system, allowing users to enable or disable context integration with clear visual indicators.

## 🎯 Props Interface

```typescript
interface ContextToggleButtonProps {
  enabled: boolean;                    // Whether context is currently enabled
  onToggle: (enabled: boolean) => void; // Callback when toggle state changes
  available: boolean;                  // Whether context file exists
  style?: ViewStyle;                   // Optional custom styling
  onLongPress?: () => void;            // Optional long press handler for debug actions
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import ContextToggleButton from '../components/ContextToggleButton';

const ChatHeader: React.FC = () => {
  const [contextEnabled, setContextEnabled] = useState(false);
  const [contextAvailable, setContextAvailable] = useState(true);
  
  return (
    <ContextToggleButton
      enabled={contextEnabled}
      onToggle={setContextEnabled}
      available={contextAvailable}
    />
  );
};
```

### With Long Press Handler

```typescript
const ChatHeader: React.FC = () => {
  const handleCreateTestContext = async () => {
    await TestContextHelper.createTestContextFile();
    // Refresh context availability
  };
  
  return (
    <ContextToggleButton
      enabled={contextEnabled}
      onToggle={setContextEnabled}
      available={contextAvailable}
      onLongPress={handleCreateTestContext}
    />
  );
};
```

## 🎨 Visual States

### Enabled State
- **Icon**: Filled database icon
- **Color**: Theme accent color
- **Opacity**: Full opacity (1.0)

### Disabled State  
- **Icon**: Outline database icon
- **Color**: Theme placeholder color
- **Opacity**: Full opacity (1.0)

### Unavailable State
- **Icon**: Outline database icon
- **Color**: Theme placeholder color
- **Opacity**: Reduced opacity (0.5)

## 🎛️ Interaction Behavior

### Standard Press
- **When Available**: Toggles context enabled/disabled
- **When Unavailable**: Calls `onLongPress` if provided
- **Feedback**: Visual state change and haptic feedback

### Long Press
- **Purpose**: Debug action (typically creates test context)
- **Availability**: Only when `onLongPress` prop is provided
- **Use Case**: Create test context when no context file exists

## ♿ Accessibility

### Dynamic Labels

```typescript
accessibilityLabel={
  available 
    ? `${enabled ? 'Disable' : 'Enable'} context`
    : 'Create test context'
}

accessibilityHint={
  available 
    ? `Context is currently ${enabled ? 'enabled' : 'disabled'}` 
    : 'Long press to create test context file'
}
```

### Screen Reader Support
- **State Announcement**: Current toggle state
- **Action Guidance**: Clear instructions for interaction
- **Context Status**: Availability information

## 📱 Platform Considerations

### iOS
- **Haptic Feedback**: Subtle feedback on state change
- **Touch Target**: Minimum 44x44 points
- **Visual Feedback**: Smooth animations

### Android
- **Ripple Effect**: Material Design touch feedback  
- **Touch Target**: Minimum 48dp
- **Accessibility**: TalkBack support

## 🧪 Testing

### Unit Tests

```typescript
describe('ContextToggleButton', () => {
  it('should render enabled state correctly', () => {
    const { getByLabelText } = render(
      <ContextToggleButton
        enabled={true}
        available={true}
        onToggle={() => {}}
      />
    );
    
    expect(getByLabelText('Disable context')).toBeTruthy();
  });

  it('should call onToggle when pressed and available', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(
      <ContextToggleButton
        enabled={false}
        available={true}
        onToggle={onToggle}
      />
    );
    
    fireEvent.press(getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('should call onLongPress when unavailable', () => {
    const onLongPress = jest.fn();
    const { getByRole } = render(
      <ContextToggleButton
        enabled={false}
        available={false}
        onToggle={() => {}}
        onLongPress={onLongPress}
      />
    );
    
    fireEvent.press(getByRole('button'));
    expect(onLongPress).toHaveBeenCalled();
  });
});
```

## 🎨 Styling

### Button Styling

```typescript
const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 34,
    minHeight: 34,
  },
});
```

### Theme Integration

```typescript
const { theme } = useTheme();

// Icon color based on state
const iconColor = enabled 
  ? theme.accent 
  : theme.placeholder;

// Icon weight based on state  
const iconWeight = enabled ? 'fill' : 'regular';
```

## 🔮 Future Enhancements

Potential improvements to the ContextToggleButton:

- **Animation**: Smooth transitions between states
- **Badge**: Show context file status or update indicator
- **Progress**: Loading state during context operations
- **Customization**: More visual customization options
- **Gestures**: Additional gesture support (swipe, double-tap)

---

*The ContextToggleButton provides intuitive control over the intelligent context system!* 🗂️⚡