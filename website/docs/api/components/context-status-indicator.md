# ContextStatusIndicator

The `ContextStatusIndicator` component displays the current status of the context system and provides manual refresh functionality.

## 📋 Overview

**Location**: `src/components/ContextStatusIndicator.tsx`
**Purpose**: Show context availability status with refresh capability

This component appears in the Model Selection Screen to inform users about context file availability and allows manual refresh of the context system.

## 🎯 Props Interface

```typescript
interface ContextStatusIndicatorProps {
  contextAvailable: boolean;    // Whether context file is available
  onRefresh: () => void;       // Callback for manual refresh action
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import ContextStatusIndicator from '../components/ContextStatusIndicator';

const ModelSelectionScreen: React.FC = () => {
  const { contextAvailable, handleRefreshContext } = useContextManager();
  
  return (
    <View>
      <ContextStatusIndicator 
        contextAvailable={contextAvailable} 
        onRefresh={handleRefreshContext} 
      />
      {/* Other content */}
    </View>
  );
};
```

### With Loading State

```typescript
const ModelSelectionScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await contextManager.forceRefresh();
    setIsRefreshing(false);
  };
  
  return (
    <ContextStatusIndicator 
      contextAvailable={contextAvailable} 
      onRefresh={handleRefresh}
    />
  );
};
```

## 🎨 Visual Design

### Available State
- **Icon**: Filled database icon in accent color
- **Text**: "Context file detected" in primary text color
- **Status**: Positive visual feedback

### Unavailable State
- **Icon**: Regular database icon in placeholder color
- **Text**: "No context file found" in placeholder color
- **Status**: Neutral visual feedback

### Layout Structure

```typescript
<View style={styles.container}>
  {/* Status Icon */}
  <Database 
    size={16} 
    color={contextAvailable ? theme.accent : theme.placeholder} 
    weight={contextAvailable ? 'fill' : 'regular'} 
  />
  
  {/* Status Text */}
  <Text style={[styles.text, { 
    color: contextAvailable ? theme.text : theme.placeholder 
  }]}>
    {contextAvailable ? 'Context file detected' : 'No context file found'}
  </Text>
  
  {/* Refresh Button */}
  <TouchableOpacity onPress={onRefresh}>
    <ArrowClockwise size={14} color={theme.placeholder} weight="bold" />
  </TouchableOpacity>
</View>
```

## 🔄 Refresh Functionality

### Manual Refresh
- **Purpose**: Allow users to manually check for context file changes
- **Trigger**: Tap the refresh icon
- **Feedback**: Button press animation and state update

### Refresh Process
1. User taps refresh button
2. Component calls `onRefresh` callback
3. Parent component triggers context system refresh
4. Context availability is re-evaluated
5. Component updates visual state

## 🎯 Behavior

### Responsive Layout
- **Flex Layout**: Text expands to fill available space
- **Icon Sizing**: Consistent 16px status icon, 14px refresh icon
- **Spacing**: 6px gap between icon and text

### Interactive Elements
- **Refresh Button**: 
  - Minimum touch target: 24x24 points
  - Rounded corners: 12px border radius
  - Padding: 4px for comfortable tapping

## ♿ Accessibility

### Screen Reader Support

```typescript
<TouchableOpacity
  onPress={onRefresh}
  accessibilityLabel="Refresh context"
  accessibilityHint="Manually refresh context from file"
>
```

### Accessibility Features
- **Clear Labels**: Descriptive text for screen readers
- **Action Hints**: Guidance on what refresh button does
- **State Information**: Current context availability status
- **Touch Targets**: Adequate size for motor accessibility

## 🎨 Styling

### Layout Styles

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
    flex: 1,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
});
```

### Theme Integration

All colors are dynamically applied based on the current theme:

```typescript
const { theme } = useTheme();

// Status icon color
const iconColor = contextAvailable ? theme.accent : theme.placeholder;

// Text color
const textColor = contextAvailable ? theme.text : theme.placeholder;

// Refresh button color
const refreshColor = theme.placeholder;
```

## 🧪 Testing

### Unit Tests

```typescript
describe('ContextStatusIndicator', () => {
  it('should show available state when context exists', () => {
    const { getByText } = render(
      <ContextStatusIndicator
        contextAvailable={true}
        onRefresh={() => {}}
      />
    );
    
    expect(getByText('Context file detected')).toBeTruthy();
  });

  it('should show unavailable state when no context', () => {
    const { getByText } = render(
      <ContextStatusIndicator
        contextAvailable={false}
        onRefresh={() => {}}
      />
    );
    
    expect(getByText('No context file found')).toBeTruthy();
  });

  it('should call onRefresh when refresh button pressed', () => {
    const onRefresh = jest.fn();
    const { getByLabelText } = render(
      <ContextStatusIndicator
        contextAvailable={true}
        onRefresh={onRefresh}
      />
    );
    
    fireEvent.press(getByLabelText('Refresh context'));
    expect(onRefresh).toHaveBeenCalled();
  });
});
```

### Integration Tests

```typescript
describe('ContextStatusIndicator Integration', () => {
  it('should update when context availability changes', async () => {
    const { rerender, getByText } = render(
      <ContextStatusIndicator
        contextAvailable={false}
        onRefresh={() => {}}
      />
    );
    
    expect(getByText('No context file found')).toBeTruthy();
    
    rerender(
      <ContextStatusIndicator
        contextAvailable={true}
        onRefresh={() => {}}
      />
    );
    
    expect(getByText('Context file detected')).toBeTruthy();
  });
});
```

## 📱 Platform Considerations

### iOS
- **Visual Feedback**: Subtle opacity changes on button press
- **Typography**: San Francisco font family
- **Spacing**: iOS design guidelines

### Android
- **Ripple Effect**: Material Design touch feedback
- **Typography**: Roboto font family
- **Elevation**: Subtle shadow for depth

## 🔧 Advanced Usage

### Custom Status Messages

```typescript
const getStatusMessage = (available: boolean, isLoading: boolean) => {
  if (isLoading) return 'Checking for context...';
  return available ? 'Context file detected' : 'No context file found';
};

// In component
<Text style={styles.text}>
  {getStatusMessage(contextAvailable, isRefreshing)}
</Text>
```

### Extended Status Information

```typescript
interface ExtendedStatusProps extends ContextStatusIndicatorProps {
  lastUpdated?: Date;
  fileSize?: number;
  chunksCount?: number;
}

// Enhanced component with additional metadata
const EnhancedContextStatusIndicator: React.FC<ExtendedStatusProps> = ({
  contextAvailable,
  lastUpdated,
  fileSize,
  chunksCount,
  onRefresh,
}) => {
  const getDetailedStatus = () => {
    if (!contextAvailable) return 'No context file found';
    
    const details = [];
    if (chunksCount) details.push(`${chunksCount} chunks`);
    if (fileSize) details.push(`${Math.round(fileSize / 1024)}KB`);
    
    return `Context ready${details.length ? ` (${details.join(', ')})` : ''}`;
  };
  
  return (
    // Enhanced UI with additional information
  );
};
```

## 🔮 Future Enhancements

Potential improvements to the ContextStatusIndicator:

- **Progress Indicator**: Show refresh progress
- **Detailed Status**: File size, last modified, chunks count
- **Error States**: Display specific error messages
- **Auto-refresh**: Automatic context checking
- **Animations**: Smooth state transitions
- **Tooltip**: Additional information on hover/long press

---

*The ContextStatusIndicator keeps users informed about the context system status!* 📊🔍