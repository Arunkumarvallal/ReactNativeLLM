# Theme Support

ReactNativeLLM provides comprehensive light and dark theme support with automatic system detection and manual override capabilities.

## 🎨 Theme System Overview

The theme system is built around React Context and provides consistent styling across all components while respecting user preferences and system settings.

### Key Features

- **Automatic Detection**: Follows system light/dark mode
- **Manual Override**: Users can force light or dark theme
- **Reset Capability**: Return to system default with long-press
- **Component Integration**: All components respect theme settings
- **Real-time Switching**: Instant theme changes without restart

## 🔧 Theme Architecture

### ThemeContext Structure

```typescript
interface ThemeContextType {
  theme: ThemeType;                    // Current active theme
  themeOverride: ThemeOverride;        // User override (light/dark/null)
  setThemeOverride: (override: ThemeOverride) => void;
  toggleTheme: () => void;             // Toggle between light/dark
}

type ThemeOverride = 'light' | 'dark' | null;
```

### Theme Provider

The `ThemeProvider` wraps the entire app and manages theme state:

```typescript
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeOverride, setThemeOverride] = useState<ThemeOverride>(null);
  const systemColorScheme = useColorScheme() as 'light' | 'dark' | null;

  const theme = useMemo(() => {
    if (themeOverride === 'dark' || (!themeOverride && systemColorScheme === 'dark')) {
      return darkTheme;
    }
    return lightTheme;
  }, [themeOverride, systemColorScheme]);

  // ... provider implementation
};
```

## 🎭 Theme Definitions

### Light Theme

```typescript
export const lightTheme = {
  background: '#fff',              // Main background
  text: '#000',                   // Primary text color
  border: '#E0E0E0',             // Border colors
  accent: '#34C759',             // Accent color (green)
  secondaryBackground: '#f5f5f5', // Secondary backgrounds
  placeholder: '#888',            // Placeholder text
  bubbleLeft: '#f0f0f0',         // AI message bubbles
  bubbleRight: '#34C759',        // User message bubbles
  inputBackground: '#fff',        // Input field background
  progressBar: '#007AFF',        // Progress indicators
  downloadIcon: '#007AFF',       // Download and action icons
  // ... more properties
};
```

### Dark Theme

```typescript  
export const darkTheme: typeof lightTheme = {
  background: '#121212',          // Dark background
  text: '#fff',                  // Light text on dark
  border: '#333',               // Subtle borders
  accent: '#34C759',            // Same green accent
  secondaryBackground: '#222',   // Secondary dark backgrounds
  placeholder: '#aaa',          // Lighter placeholder
  bubbleLeft: '#222',          // Dark AI bubbles
  bubbleRight: '#34C759',      // Green user bubbles
  inputBackground: '#1e1e1e',  // Dark input background
  progressBar: '#007AFF',      // Blue progress
  downloadIcon: '#007AFF',     // Blue action icons
  // ... matching properties
};
```

### Type Safety

TypeScript ensures theme consistency:

```typescript
export type ThemeType = typeof lightTheme;
```

This ensures dark theme has all the same properties as light theme.

## 🎯 Using Themes in Components

### Basic Usage

```typescript
import { useTheme } from '../theme/ThemeContext';

const MyComponent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Hello World
      </Text>
    </View>
  );
};
```

### Dynamic Styling

```typescript
const getDynamicStyle = (theme: ThemeType) => ({
  container: {
    backgroundColor: theme.background,
    borderColor: theme.border,
  },
  text: {
    color: theme.text,
  },
  button: {
    backgroundColor: theme.accent,
  },
});

// In component
const dynamicStyles = getDynamicStyle(theme);
```

### Conditional Styling

```typescript
const getThemeAwareStyle = (theme: ThemeType, isDark: boolean) => ({
  shadow: isDark ? {} : {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
```

## 🎮 Theme Controls

### Theme Toggle Button

The `ThemeToggleButton` component provides theme switching:

```typescript
const ThemeToggleButton: React.FC = ({ style }) => {
  const { theme, toggleTheme, setThemeOverride } = useTheme();
  const isDark = theme === darkTheme;
  
  return (
    <TouchableOpacity
      onPress={toggleTheme}                    // Toggle light/dark
      onLongPress={() => setThemeOverride(null)} // Reset to system
      style={[styles.button, style]}
    >
      {isDark ? (
        <MoonIcon size={24} color={theme.text} weight="fill" />
      ) : (
        <SunIcon size={24} color={theme.text} weight="fill" />
      )}
    </TouchableOpacity>
  );
};
```

### Toggle Behavior

1. **Short Press**: Toggle between light and dark
2. **Long Press**: Reset to system preference
3. **Visual Feedback**: Icon changes to reflect current theme

## 🎨 Theme-Aware Components

### Model Selection

Model selection respects theme for card styling:

```typescript
// Dynamic styling based on theme and selection state
<TouchableOpacity
  style={[
    styles.modelRow,
    isSelected ? {
      backgroundColor: isColorDark(theme.background) ? '#23243f' : '#ffffff',
      shadowColor: '#000',
      shadowOpacity: 0.18,
    } : {
      backgroundColor: theme.secondaryBackground
    }
  ]}
>
```

### Chat Interface

Chat bubbles adapt to theme:

```typescript
const renderBubble = (props: any) => (
  <Bubble
    {...props}
    wrapperStyle={{
      left: { backgroundColor: theme.bubbleLeft },
      right: { backgroundColor: theme.bubbleRight },
    }}
    textStyle={{
      left: { color: theme.text },
      right: { color: theme.text },
    }}
  />
);
```

### Input Fields

Input styling adapts to theme:

```typescript
const renderComposer = (props: any) => (
  <Composer
    {...props}
    textInputStyle={{ color: theme.text }}
    placeholderTextColor={theme.placeholder}
  />
);
```

## 🎯 Advanced Theme Features

### Color Utilities

The app includes utilities for theme-aware styling:

```typescript
// Check if a color is dark
function isColorDark(hex: string) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance < 0.5;
}
```

### Conditional Shadows

Shadows are applied conditionally based on theme:

```typescript
const shadowStyle = isColorDark(theme.background) ? {} : {
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
};
```

## 📱 Platform Integration

### System Theme Detection

The app uses React Native's `useColorScheme` hook:

```typescript
const systemColorScheme = useColorScheme() as 'light' | 'dark' | null;
```

### iOS Integration
- Respects iOS 13+ dark mode settings
- Follows Control Center theme changes
- Supports automatic switching based on time

### Android Integration  
- Respects Android 10+ dark theme
- Follows system theme in Settings
- Supports Quick Settings theme toggle

## 🎨 Customizing Themes

### Adding New Colors

To add new theme properties:

1. **Add to Light Theme**:
```typescript
export const lightTheme = {
  // ... existing properties
  newProperty: '#FF6B6B',
};
```

2. **Add to Dark Theme**:
```typescript
export const darkTheme: typeof lightTheme = {
  // ... existing properties  
  newProperty: '#FF8E8E',
};
```

3. **TypeScript automatically ensures consistency**

### Creating Custom Themes

```typescript
const customTheme = {
  ...lightTheme,
  accent: '#FF3B30',        // Red accent
  bubbleRight: '#FF3B30',   // Red user bubbles
};
```

### Theme Variants

You could create theme variants:

```typescript
const blueTheme = {
  ...lightTheme,
  accent: '#007AFF',
  bubbleRight: '#007AFF',
};

const purpleTheme = {
  ...lightTheme,
  accent: '#5856D6',
  bubbleRight: '#5856D6',
};
```

## 🔍 Theme Debugging

### Debug Theme State

```typescript
const { theme, themeOverride } = useTheme();
console.log('Current theme:', theme === darkTheme ? 'dark' : 'light');
console.log('Theme override:', themeOverride);
console.log('System preference:', useColorScheme());
```

### Visual Theme Inspector

For development, you could add a theme inspector:

```typescript
const ThemeInspector: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ padding: 20 }}>
      {Object.entries(theme).map(([key, value]) => (
        <View key={key} style={{ flexDirection: 'row', marginVertical: 2 }}>
          <Text>{key}: </Text>
          <View style={{ width: 20, height: 20, backgroundColor: value }} />
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  );
};
```

## 🚨 Common Issues

### Theme Not Applying

**Check Provider Wrapping**:
```typescript
// Ensure ThemeProvider wraps your app
<ThemeProvider>
  <App />
</ThemeProvider>
```

**Verify Hook Usage**:
```typescript
// Make sure to use the hook
const { theme } = useTheme();
```

### Inconsistent Colors

**Use Theme Variables**:
```typescript
❌ backgroundColor: '#fff'
✅ backgroundColor: theme.background
```

**Check TypeScript Errors**:
```typescript
// TypeScript will catch missing theme properties
style={{ color: theme.nonExistentProperty }} // Error!
```

### Performance Issues

**Optimize Re-renders**:
```typescript
// Memoize theme-dependent styles
const styles = useMemo(() => ({
  container: { backgroundColor: theme.background },
}), [theme]);
```

## 🎯 Best Practices

### Theme Usage Guidelines

1. **Always Use Theme Variables**: Never hardcode colors
2. **Test Both Themes**: Ensure components work in light and dark
3. **Consider Accessibility**: Ensure sufficient contrast
4. **Use Semantic Names**: Name theme properties by purpose, not color

### Component Development

```typescript
// Good: Semantic styling
<Text style={{ color: theme.text }}>Primary text</Text>
<Text style={{ color: theme.placeholder }}>Secondary text</Text>

// Avoid: Direct color references  
<Text style={{ color: '#000' }}>Text</Text>
```

### Performance Optimization

```typescript
// Memoize expensive theme calculations
const themeAwareStyles = useMemo(() => 
  createStyles(theme), [theme]
);
```

## 🔮 Future Enhancements

Planned improvements to the theme system:

- **More Theme Options**: Additional color schemes
- **Custom Accent Colors**: User-selectable accent colors
- **Scheduled Themes**: Automatic theme switching by time
- **Accessibility Themes**: High contrast and large text options
- **Theme Persistence**: Remember user preferences across app launches

---

*Beautiful themes make the app enjoyable in any lighting condition!* 🌙☀️