# ThemeToggleButton

The `ThemeToggleButton` component provides users with an intuitive way to switch between light and dark themes in ReactNativeLLM.

## 📋 Overview

**Location**: `src/components/ThemeToggleButton.tsx`
**Purpose**: Toggle between light and dark themes with visual feedback

This component integrates with the theme system to provide seamless theme switching while maintaining user preferences and system integration.

## 🎯 Props Interface

```typescript
interface ThemeToggleButtonProps {
  style?: ViewStyle;    // Optional custom styling
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import ThemeToggleButton from '../components/ThemeToggleButton';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>App Title</Text>
      <ThemeToggleButton />
    </View>
  );
};
```

### With Custom Styling

```typescript
const CustomHeader: React.FC = () => {
  return (
    <View style={styles.controls}>
      <NetworkInfo theme={theme} />
      <ThemeToggleButton style={styles.themeButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    marginLeft: 12,
    padding: 8,
  },
});
```

### In Navigation Header

```typescript
const ChatHeader: React.FC = () => {
  return (
    <View style={styles.topRow}>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeftIcon size={22} color={theme.text} />
      </TouchableOpacity>
      <Text style={styles.title}>{modelId}</Text>
      <ThemeToggleButton style={styles.themeButton} />
    </View>
  );
};
```

## 🎨 Theme Integration

### Theme Context Usage

```typescript
const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ style }) => {
  const { theme, themeOverride, toggleTheme, setThemeOverride } = useTheme();
  const isDark = theme === darkTheme;
  
  // Component implementation
};
```

### Theme Detection

```typescript
// Determine current theme
const isDark = theme === darkTheme;

// Get theme override status
const hasOverride = themeOverride !== null;
```

## 🔄 Interaction Behavior

### Short Press (Toggle)

```typescript
<TouchableOpacity
  onPress={toggleTheme}
  style={[styles.button, style]}
>
```

**Behavior**:
- Toggles between light and dark theme
- Overrides system preference
- Immediate visual feedback

### Long Press (Reset)

```typescript
<TouchableOpacity
  onLongPress={() => setThemeOverride(null)}
  style={[styles.button, style]}
>
```

**Behavior**:
- Resets to system default theme
- Removes manual override
- Returns to automatic theme detection

## 🎭 Visual States

### Light Theme Active
- **Icon**: `SunIcon` (filled)
- **Color**: Current theme text color
- **Meaning**: Light theme is currently active

### Dark Theme Active
- **Icon**: `MoonIcon` (filled)
- **Color**: Current theme text color
- **Meaning**: Dark theme is currently active

### Icon Implementation

```typescript
{isDark ? (
  <MoonIcon size={24} color={theme.text} weight="fill" />
) : (
  <SunIcon size={24} color={theme.text} weight="fill" />
)}
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
  },
});
```

**Features**:
- **Rounded Design**: 16px border radius for modern look
- **Adequate Padding**: 6px for comfortable touch target
- **Centered Content**: Icon perfectly centered
- **Flexible Sizing**: Adapts to icon size

### Theme-Aware Colors

```typescript
// Icon color matches current theme
color={theme.text}

// Consistent with other UI elements
// No background color (transparent)
```

## ♿ Accessibility

### Screen Reader Support

```typescript
<TouchableOpacity
  accessibilityLabel="Toggle theme"
  accessibilityHint={`Currently using ${isDark ? 'dark' : 'light'} theme. Tap to switch, long press to reset to system default.`}
  accessibilityRole="button"
>
```

### Accessibility Features
- **Clear Labels**: Descriptive action labels
- **State Information**: Current theme announced
- **Interaction Hints**: Guidance for both short and long press
- **Role Definition**: Properly marked as button

## 🧪 Testing

### Unit Tests

```typescript
describe('ThemeToggleButton', () => {
  it('should render sun icon in light theme', () => {
    const { getByTestId } = render(
      <ThemeProvider initialTheme="light">
        <ThemeToggleButton />
      </ThemeProvider>
    );
    
    expect(getByTestId('sun-icon')).toBeTruthy();
  });

  it('should render moon icon in dark theme', () => {
    const { getByTestId } = render(
      <ThemeProvider initialTheme="dark">
        <ThemeToggleButton />
      </ThemeProvider>
    );
    
    expect(getByTestId('moon-icon')).toBeTruthy();
  });

  it('should toggle theme on press', () => {
    const { getByRole, getByTestId } = render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    
    // Initially light theme (sun icon)
    expect(getByTestId('sun-icon')).toBeTruthy();
    
    fireEvent.press(button);
    
    // Should switch to dark theme (moon icon)
    expect(getByTestId('moon-icon')).toBeTruthy();
  });

  it('should reset to system theme on long press', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ThemeToggleButton />
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    
    // Toggle to create override
    fireEvent.press(button);
    
    // Long press to reset
    fireEvent.longPress(button);
    
    // Should return to system theme
    // Test implementation depends on mock system theme
  });
});
```

### Integration Tests

```typescript
describe('ThemeToggleButton Integration', () => {
  it('should integrate with theme context', () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return (
        <View testID="themed-container" style={{ backgroundColor: theme.background }}>
          <ThemeToggleButton />
        </View>
      );
    };
    
    const { getByTestId, getByRole } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const container = getByTestId('themed-container');
    const button = getByRole('button');
    
    // Get initial background color
    const initialBg = container.props.style.backgroundColor;
    
    // Toggle theme
    fireEvent.press(button);
    
    // Background should change
    const newBg = container.props.style.backgroundColor;
    expect(newBg).not.toBe(initialBg);
  });
});
```

## 📱 Platform Considerations

### iOS Features
- **System Integration**: Respects iOS dark mode settings
- **Haptic Feedback**: Subtle feedback on theme change
- **Status Bar**: Coordinates with status bar appearance

### Android Features
- **Material Design**: Follows Material theme guidelines
- **System Integration**: Respects Android dark theme
- **Ripple Effect**: Touch feedback on button press

### System Theme Detection

```typescript
// Automatic system theme following
const systemColorScheme = useColorScheme();

// Theme resolution logic
const theme = useMemo(() => {
  if (themeOverride === 'dark' || (!themeOverride && systemColorScheme === 'dark')) {
    return darkTheme;
  }
  return lightTheme;
}, [themeOverride, systemColorScheme]);
```

## 🔧 Advanced Usage

### Custom Theme Toggle

```typescript
interface CustomThemeToggleProps extends ThemeToggleButtonProps {
  showLabel?: boolean;
  compact?: boolean;
}

const CustomThemeToggle: React.FC<CustomThemeToggleProps> = ({
  showLabel = false,
  compact = false,
  style,
}) => {
  const { theme, toggleTheme, setThemeOverride } = useTheme();
  const isDark = theme === darkTheme;
  
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      onLongPress={() => setThemeOverride(null)}
      style={[
        styles.button,
        compact && styles.compact,
        style
      ]}
    >
      {isDark ? (
        <MoonIcon size={compact ? 20 : 24} color={theme.text} weight="fill" />
      ) : (
        <SunIcon size={compact ? 20 : 24} color={theme.text} weight="fill" />
      )}
      {showLabel && (
        <Text style={[styles.label, { color: theme.text }]}>
          {isDark ? 'Dark' : 'Light'}
        </Text>
      )}
    </TouchableOpacity>
  );
};
```

### Theme Toggle with Animation

```typescript
const AnimatedThemeToggle: React.FC<ThemeToggleButtonProps> = ({ style }) => {
  const { theme, toggleTheme } = useTheme();
  const [rotateAnim] = useState(new Animated.Value(0));
  const isDark = theme === darkTheme;
  
  const handleToggle = () => {
    // Animate rotation
    Animated.timing(rotateAnim, {
      toValue: rotateAnim._value + 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    toggleTheme();
  };
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  return (
    <TouchableOpacity onPress={handleToggle} style={[styles.button, style]}>
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        {isDark ? (
          <MoonIcon size={24} color={theme.text} weight="fill" />
        ) : (
          <SunIcon size={24} color={theme.text} weight="fill" />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
```

## 🔮 Future Enhancements

Potential improvements to ThemeToggleButton:

- **Theme Preview**: Quick preview of opposite theme
- **Custom Themes**: Support for additional theme options
- **Scheduled Themes**: Automatic theme switching by time
- **Gesture Support**: Swipe gestures for theme switching
- **Transition Animations**: Smooth theme transition effects
- **Theme Persistence**: Remember theme choice across app launches
- **Accessibility Themes**: High contrast and accessibility options

## 🚨 Common Issues

### Theme Not Persisting
- **Solution**: Implement theme persistence in AsyncStorage
- **Cause**: Theme state resets on app restart

### Animation Issues
- **Solution**: Use native driver for smooth animations
- **Cause**: JavaScript thread blocking during theme changes

### System Theme Sync
- **Solution**: Properly handle system theme changes
- **Cause**: App theme doesn't update when system theme changes

---

*ThemeToggleButton provides elegant theme switching that enhances user experience!* 🌙☀️