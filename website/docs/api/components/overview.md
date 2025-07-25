# Components Overview

ReactNativeLLM is built with a modular component architecture. This section provides comprehensive documentation for all React components in the application.

## 🏗️ Component Architecture

The component structure follows React Native best practices with clear separation of concerns:

- **Screen Components**: Top-level navigation screens
- **UI Components**: Reusable interface elements  
- **Header Components**: Navigation and control elements
- **Specialized Components**: Feature-specific components

## 📱 Screen Components

### ChatScreen
The main chat interface where users interact with AI models.

**Location**: `src/screens/ChatScreen.tsx`
**Purpose**: Manages chat conversations, model preparation, and context integration

### ModelSelectionScreen  
The initial screen for model management and selection.

**Location**: `src/screens/ModelSelectionScreen.tsx`
**Purpose**: Handles model downloading, selection, and navigation to chat

## 🎨 UI Components

### ChatHeader
Header component for the chat screen with controls and navigation.

**Props**:
```typescript
interface ChatHeaderProps {
  modelId: string;
  contextEnabled: boolean;
  contextAvailable: boolean;
  onContextToggle: (enabled: boolean) => void;
  onCreateTestContext: () => void;
  onRefreshContext: () => void;
  onBack: () => void;
}
```

### CustomGiftedChat
Customized chat interface built on react-native-gifted-chat.

**Props**:
```typescript
interface CustomGiftedChatProps {
  messages: IMessage[];
  onSend: (messages: IMessage[]) => void;
  text: string;
  onInputTextChanged: (text: string) => void;
}
```

### ModelSelection
Component for displaying and managing AI models.

**Props**:
```typescript
interface ModelSelectionProps {
  models: AiModelSettings[];
  downloadStatus: Record<string, DownloadStatus>;
  selectedModelId: string | null;
  onDownloadModel: (model: AiModelSettings) => void;
  onCancelDownload: (model: AiModelSettings) => void;
  onDeleteModel: (model: AiModelSettings) => void;
  onModelSelected: (modelId: string) => void;
}
```

## 🎛️ Control Components

### ContextToggleButton
Button for enabling/disabling context integration.

**Props**:
```typescript
interface ContextToggleButtonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  available: boolean;
  style?: ViewStyle;
  onLongPress?: () => void;
}
```

### ThemeToggleButton
Button for switching between light and dark themes.

**Props**:
```typescript
interface ThemeToggleButtonProps {
  style?: ViewStyle;
}
```

### ContextStatusIndicator
Displays context availability status and provides refresh functionality.

**Props**:
```typescript
interface ContextStatusIndicatorProps {
  contextAvailable: boolean;
  onRefresh: () => void;
}
```

## 📊 Information Components

### NetworkInfo
Displays network connectivity status.

**Props**:
```typescript
interface NetworkInfoProps {
  theme: ThemeType;
}
```

## 🎯 Component Usage Patterns

### Theme Integration

All components integrate with the theme system:

```typescript
import { useTheme } from '../theme/ThemeContext';

const MyComponent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>
        Content
      </Text>
    </View>
  );
};
```

### Icon Usage

Components use Phosphor React Native for consistent iconography:

```typescript
import { ArrowLeftIcon, DatabaseIcon } from 'phosphor-react-native';

<ArrowLeftIcon size={22} color={theme.text} weight="bold" />
<DatabaseIcon size={22} color={theme.accent} weight="fill" />
```

### Style Patterns

Components follow consistent styling patterns:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Theme colors applied via props
  },
  button: {
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    // Theme colors applied via props
  },
});
```

## 🔧 Component Props

### Common Prop Patterns

#### Style Props
Most components accept optional style customization:
```typescript
interface ComponentProps {
  style?: ViewStyle;
}
```

#### Callback Props
Event handlers follow consistent naming:
```typescript
interface ComponentProps {
  onPress?: () => void;
  onLongPress?: () => void;
  onToggle?: (enabled: boolean) => void;
}
```

#### State Props
Components receive state through props rather than managing internally:
```typescript
interface ComponentProps {
  enabled: boolean;
  available: boolean;
  loading: boolean;
}
```

## 📦 Component Dependencies

### External Dependencies
- `react-native-gifted-chat`: Chat interface
- `phosphor-react-native`: Icon library
- `react-native-progress`: Progress indicators
- `@react-native-community/netinfo`: Network information

### Internal Dependencies
- `../theme/ThemeContext`: Theme integration
- `../utils/constants`: Shared constants
- `../types/*`: TypeScript type definitions

## 🎨 Styling Guidelines

### Responsive Design
Components adapt to different screen sizes:
```typescript
const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400, // Limit width on tablets
  },
});
```

### Accessibility
Components include accessibility features:
```typescript
<TouchableOpacity
  accessibilityLabel="Toggle context"
  accessibilityHint="Enable or disable context integration"
>
```

### Platform Differences
Components handle platform-specific differences:
```typescript
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

## 🧪 Testing Components

### Component Testing Structure
```typescript
// Example test structure
describe('ChatHeader', () => {
  it('should render correctly', () => {
    // Test rendering
  });
  
  it('should handle context toggle', () => {
    // Test interaction
  });
  
  it('should apply theme correctly', () => {
    // Test theme integration
  });
});
```

### Mock Requirements
Components may require mocks for:
- Theme context
- Navigation
- External libraries
- File system operations

## 🔍 Component Development

### Creating New Components

1. **Create Component File**: Follow naming convention
2. **Define Props Interface**: Use TypeScript interfaces
3. **Implement Component**: Follow established patterns
4. **Add Theme Integration**: Use `useTheme` hook
5. **Add Documentation**: Document props and usage
6. **Write Tests**: Cover main functionality

### Best Practices

- **Single Responsibility**: Each component has one clear purpose
- **Props Interface**: Always define TypeScript interfaces
- **Theme Integration**: Use theme variables for all colors
- **Accessibility**: Include proper accessibility labels
- **Error Boundaries**: Handle errors gracefully
- **Performance**: Use `React.memo` for expensive components

## 📚 Component Documentation

Each component in this section includes:

- **Purpose**: What the component does
- **Props**: All available properties with types
- **Usage Examples**: How to use the component
- **Styling**: Available style customizations
- **Accessibility**: Accessibility features
- **Platform Notes**: Platform-specific behaviors

Navigate through the sidebar to explore detailed documentation for each component.

---

*Well-designed components create a consistent and maintainable user interface!* 🎨⚛️