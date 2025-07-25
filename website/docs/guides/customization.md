# Customization Guide

Learn how to customize ReactNativeLLM to match your specific needs, branding, and workflow preferences.

## 🎨 Visual Customization

### Theme Customization

#### Custom Color Schemes

```typescript
// src/theme/theme.ts - Custom theme example
export const customLightTheme = {
  ...lightTheme,
  
  // Brand colors
  accent: '#6366F1',           // Indigo accent
  bubbleRight: '#6366F1',      // Matching user bubbles
  
  // Custom UI elements
  primaryButton: '#6366F1',
  secondaryButton: '#E5E7EB',
  warning: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  
  // Typography
  headingText: '#1F2937',
  bodyText: '#374151',
  captionText: '#6B7280',
};

export const customDarkTheme = {
  ...darkTheme,
  
  // Dark brand colors
  accent: '#818CF8',           // Lighter indigo for dark mode
  bubbleRight: '#818CF8',
  
  // Dark UI elements
  primaryButton: '#818CF8',
  secondaryButton: '#374151',
  warning: '#FBBF24',
  success: '#34D399',
  error: '#F87171',
  
  // Dark typography
  headingText: '#F9FAFB',
  bodyText: '#E5E7EB',
  captionText: '#9CA3AF',
};
```

#### Applying Custom Themes

```typescript
// src/theme/ThemeContext.tsx - Modified theme provider
const theme = useMemo(() => {
  if (themeOverride === 'dark' || (!themeOverride && systemColorScheme === 'dark')) {
    return customDarkTheme; // Use custom dark theme
  }
  return customLightTheme;   // Use custom light theme
}, [themeOverride, systemColorScheme]);
```

### Typography Customization

```typescript
// src/theme/typography.ts - Custom typography system
export const typography = {
  fonts: {
    regular: 'System',          // Default system font
    medium: 'System-Medium',    // Or custom font like 'Inter-Medium'
    bold: 'System-Bold',        // Or 'Inter-Bold'
    code: 'SF Mono',           // Monospace for code
  },
  
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Usage in components
const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xl * typography.lineHeights.tight,
    fontWeight: typography.weights.bold,
  },
  body: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
});
```

### Icon Customization

```typescript
// src/components/CustomIcons.tsx - Custom icon mappings
import { 
  ChatCircle, 
  Robot, 
  User,
  // Add your custom icons
  YourCustomIcon 
} from 'phosphor-react-native';

export const AppIcons = {
  // Chat icons
  chat: ChatCircle,
  ai: Robot,              // Or your custom AI icon
  user: User,             // Or your custom user icon
  
  // Action icons
  send: YourCustomIcon,   // Custom send icon
  context: Database,      // Or custom context icon
  
  // Theme icons
  light: Sun,
  dark: Moon,
};

// Usage in components
import { AppIcons } from '../components/CustomIcons';

<AppIcons.ai size={24} color={theme.accent} weight="fill" />
```

## 🔧 Functional Customization

### Custom Context Processing

```typescript
// src/services/CustomContextProcessor.ts
export class CustomContextProcessor extends ContextProcessor {
  
  // Override keyword extraction for domain-specific terms
  extractKeywords(content: string): string[] {
    const baseKeywords = super.extractKeywords(content);
    
    // Add domain-specific keyword extraction
    const domainKeywords = this.extractDomainKeywords(content);
    const technicalTerms = this.extractTechnicalTerms(content);
    
    return [...baseKeywords, ...domainKeywords, ...technicalTerms];
  }
  
  private extractDomainKeywords(content: string): string[] {
    // Custom domain-specific keyword extraction
    const domainPatterns = [
      /\b[A-Z][a-zA-Z]*(?:Service|Manager|Controller|Handler)\b/g, // Service classes
      /\b(?:API|SDK|CLI|IDE|UI|UX)\b/g,                           // Acronyms
      /\b\w+(?:\.js|\.ts|\.jsx|\.tsx|\.py|\.java)\b/g,          // File extensions
    ];
    
    const keywords: string[] = [];
    
    domainPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      keywords.push(...matches);
    });
    
    return [...new Set(keywords)]; // Remove duplicates
  }
  
  private extractTechnicalTerms(content: string): string[] {
    const technicalTerms = [
      'React Native', 'TypeScript', 'JavaScript', 'Node.js',
      'iOS', 'Android', 'API', 'REST', 'GraphQL', 'JSON',
      'authentication', 'authorization', 'database', 'cache',
      'performance', 'optimization', 'testing', 'debugging'
    ];
    
    return technicalTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    );
  }
  
  // Custom relevance scoring
  calculateRelevanceScore(query: string, chunk: ContextChunk): number {
    const baseScore = super.calculateRelevanceScore(query, chunk);
    
    // Boost score for code-related queries
    if (this.isCodeRelated(query) && this.containsCode(chunk.content)) {
      return Math.min(baseScore * 1.5, 1.0);
    }
    
    // Boost for project-specific terms
    if (this.containsProjectTerms(query, chunk.content)) {
      return Math.min(baseScore * 1.3, 1.0);
    }
    
    return baseScore;
  }
  
  private isCodeRelated(query: string): boolean {
    const codeTerms = ['code', 'function', 'method', 'class', 'component', 'api', 'implement'];
    return codeTerms.some(term => query.toLowerCase().includes(term));
  }
  
  private containsCode(content: string): boolean {
    // Detect code blocks or inline code
    return /```[\s\S]*?```|`[^`]+`/.test(content);
  }
}
```

### Custom Model Configuration

```typescript
// src/config/ModelConfig.ts - Custom model settings
export interface CustomModelConfig {
  modelId: string;
  displayName: string;
  description: string;
  category: 'coding' | 'general' | 'creative' | 'analysis';
  performance: 'fast' | 'balanced' | 'quality';
  specializations: string[];
  customPrompts: {
    system?: string;
    contextPrefix?: string;
    contextSuffix?: string;
  };
  generationConfig: {
    temperature: number;
    maxTokens: number;
    topP?: number;
    topK?: number;
  };
}

export const customModelConfigs: CustomModelConfig[] = [
  {
    modelId: 'llama-2-7b',
    displayName: 'Llama 2 7B (Coding)',
    description: 'Optimized for code generation and programming assistance',
    category: 'coding',
    performance: 'balanced',
    specializations: ['JavaScript', 'TypeScript', 'React Native', 'Node.js'],
    customPrompts: {
      system: 'You are a helpful coding assistant specialized in React Native development.',
      contextPrefix: '[CODING CONTEXT]',
      contextSuffix: '[END CONTEXT] Please provide code-focused assistance.',
    },
    generationConfig: {
      temperature: 0.3,      // Lower for more deterministic code
      maxTokens: 2048,
      topP: 0.9,
    },
  },
  {
    modelId: 'mistral-7b',
    displayName: 'Mistral 7B (General)',
    description: 'Balanced model for general conversation and analysis',
    category: 'general',
    performance: 'quality',
    specializations: ['General Knowledge', 'Analysis', 'Writing'],
    customPrompts: {
      system: 'You are a knowledgeable and helpful assistant.',
      contextPrefix: '[PERSONAL CONTEXT]',
      contextSuffix: '[END CONTEXT] Please provide thoughtful assistance.',
    },
    generationConfig: {
      temperature: 0.7,      // Higher for more creative responses
      maxTokens: 4096,
      topP: 0.95,
    },
  },
];

// Usage in model selection
export const getModelConfig = (modelId: string): CustomModelConfig | null => {
  return customModelConfigs.find(config => config.modelId === modelId) || null;
};
```

### Custom Chat Interface

```typescript
// src/components/CustomChatInterface.tsx
interface CustomChatProps {
  showTimestamps?: boolean;
  enableMessageActions?: boolean;
  customBubbleRenderer?: (props: BubbleProps) => React.ReactElement;
  customInputRenderer?: (props: InputToolbarProps) => React.ReactElement;
  messageGrouping?: boolean;
  maxMessageLength?: number;
}

export const CustomChatInterface: React.FC<CustomChatProps> = ({
  showTimestamps = false,
  enableMessageActions = false,
  customBubbleRenderer,
  customInputRenderer,
  messageGrouping = true,
  maxMessageLength = 2000,
  ...giftedChatProps
}) => {
  const { theme } = useTheme();
  
  const renderBubble = customBubbleRenderer || ((props: any) => (
    <View>
      {/* Custom bubble with timestamps */}
      {showTimestamps && (
        <Text style={styles.timestamp}>
          {formatTimestamp(props.currentMessage.createdAt)}
        </Text>
      )}
      
      <Bubble
        {...props}
        wrapperStyle={{
          left: { 
            backgroundColor: theme.bubbleLeft,
            borderRadius: 16,
            marginVertical: 2,
          },
          right: { 
            backgroundColor: theme.bubbleRight,
            borderRadius: 16,
            marginVertical: 2,
          },
        }}
        textStyle={{
          left: { color: theme.text, fontSize: 15, lineHeight: 20 },
          right: { color: theme.text, fontSize: 15, lineHeight: 20 },
        }}
      />
      
      {/* Message actions */}
      {enableMessageActions && (
        <MessageActions message={props.currentMessage} />
      )}
    </View>
  ));
  
  const renderInputToolbar = customInputRenderer || ((props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: theme.inputBackground,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingVertical: 8,
      }}
      renderComposer={(composerProps) => (
        <Composer
          {...composerProps}
          textInputStyle={{
            color: theme.text,
            fontSize: 16,
            lineHeight: 20,
            maxHeight: 100,
          }}
          placeholderTextColor={theme.placeholder}
          placeholder="Type your message..."
          multiline
          maxLength={maxMessageLength}
        />
      )}
    />
  ));
  
  return (
    <GiftedChat
      {...giftedChatProps}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      messagesContainerStyle={{
        backgroundColor: theme.background,
        paddingHorizontal: 8,
      }}
      // Group messages from same user within 5 minutes
      messageGrouping={messageGrouping}
      messageGroupingDelay={5 * 60 * 1000}
    />
  );
};

// Message actions component
const MessageActions: React.FC<{ message: IMessage }> = ({ message }) => {
  const { theme } = useTheme();
  
  const handleCopy = () => {
    Clipboard.setString(message.text);
    // Show toast or feedback
  };
  
  const handleShare = () => {
    Share.share({ message: message.text });
  };
  
  return (
    <View style={styles.messageActions}>
      <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
        <Copy size={16} color={theme.placeholder} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
        <ShareNetwork size={16} color={theme.placeholder} />
      </TouchableOpacity>
    </View>
  );
};
```

## 🎛️ Configuration Customization

### Environment-Specific Configuration

```typescript
// src/config/AppConfig.ts - Environment-based configuration
interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  features: {
    contextSystem: boolean;
    multipleModels: boolean;
    advancedSettings: boolean;
    debugMode: boolean;
    analytics: boolean;
  };
  limits: {
    maxModels: number;
    maxContextSize: number;
    maxMessageHistory: number;
    maxFileSize: number;
  };
  ui: {
    showModelSelectionOnStartup: boolean;
    enableBetaFeatures: boolean;
    customBranding: boolean;
  };
}

const developmentConfig: AppConfig = {
  environment: 'development',
  features: {
    contextSystem: true,
    multipleModels: true,
    advancedSettings: true,
    debugMode: true,
    analytics: false,
  },
  limits: {
    maxModels: 10,
    maxContextSize: 10000,
    maxMessageHistory: 1000,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  ui: {
    showModelSelectionOnStartup: true,
    enableBetaFeatures: true,
    customBranding: false,
  },
};

const productionConfig: AppConfig = {
  environment: 'production',
  features: {
    contextSystem: true,
    multipleModels: true,
    advancedSettings: false,
    debugMode: false,
    analytics: true,
  },
  limits: {
    maxModels: 5,
    maxContextSize: 6000,
    maxMessageHistory: 500,
    maxFileSize: 20 * 1024 * 1024, // 20MB
  },
  ui: {
    showModelSelectionOnStartup: true,
    enableBetaFeatures: false,
    customBranding: true,
  },
};

export const getAppConfig = (): AppConfig => {
  return __DEV__ ? developmentConfig : productionConfig;
};
```

### Custom Context Configuration Templates

```typescript
// src/config/ContextTemplates.ts - Pre-built context templates
export const contextTemplates = {
  developer: `# Developer Profile

## About Me
I'm a software developer with experience in:
- Programming languages: [Add your languages]
- Frameworks: [Add your frameworks]
- Current focus: [Add current learning goals]

## Current Projects
### Project Name
- Description: [Project description]
- Technologies: [Tech stack]
- Challenges: [Current challenges]

## Preferences
- Code style: [Your preferences]
- Architecture patterns: [Preferred patterns]
- Tools: [Favorite tools]

## Goals
- Short term: [Learning goals]
- Long term: [Career goals]`,

  student: `# Student Profile

## Academic Background
- Major: [Your major]
- Year: [Current year]
- Institution: [School name]

## Current Courses
- [Course 1]: [Description and progress]
- [Course 2]: [Description and progress]

## Projects
### Academic Projects
- [Project name]: [Description]

### Personal Projects
- [Project name]: [Description]

## Learning Goals
- This semester: [Current goals]
- This year: [Yearly goals]

## Interests
- Topics I'm passionate about: [List topics]
- Skills I want to develop: [List skills]`,

  researcher: `# Researcher Profile

## Research Area
- Primary field: [Your field]
- Specialization: [Specific area]
- Current research: [Current projects]

## Publications
- [Paper title]: [Brief description]
- [Paper title]: [Brief description]

## Methodology
- Preferred approaches: [Research methods]
- Tools and software: [Research tools]
- Data sources: [Where you get data]

## Current Questions
- Research questions: [What you're investigating]
- Hypotheses: [What you're testing]

## Collaboration
- Current collaborators: [People you work with]
- Institutions: [Partner organizations]`,
};

export const generateContextTemplate = (type: keyof typeof contextTemplates): string => {
  return contextTemplates[type];
};
```

## 📱 Platform-Specific Customization

### iOS Customization

```typescript
// src/config/IOSConfig.ts - iOS-specific customizations
export const iosCustomizations = {
  // Status bar styling
  statusBar: {
    barStyle: 'dark-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
  },
  
  // Navigation styling
  navigation: {
    headerStyle: {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTitleStyle: {
      fontWeight: '600' as const,
      fontSize: 18,
    },
  },
  
  // Haptic feedback
  haptics: {
    enableOnPress: true,
    enableOnSuccess: true,
    enableOnError: true,
  },
  
  // Safe area handling
  safeArea: {
    forceInsets: {
      top: 'always' as const,
      bottom: 'always' as const,
    },
  },
};

// Usage in components
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // Apply iOS-specific styles
  StatusBar.setBarStyle(iosCustomizations.statusBar.barStyle);
}
```

### Android Customization

```typescript
// src/config/AndroidConfig.ts - Android-specific customizations
export const androidCustomizations = {
  // Status bar styling
  statusBar: {
    backgroundColor: 'transparent',
    translucent: true,
    barStyle: 'dark-content' as const,
  },
  
  // Navigation styling
  navigation: {
    headerStyle: {
      elevation: 4,
      backgroundColor: '#FFFFFF',
    },
    headerTitleStyle: {
      fontWeight: '500' as const,
      fontSize: 20,
    },
  },
  
  // Material design elements
  materialDesign: {
    rippleColor: 'rgba(0, 0, 0, 0.12)',
    elevation: {
      card: 2,
      button: 4,
      modal: 8,
    },
  },
  
  // Hardware back button
  hardwareBackButton: {
    enabled: true,
    exitOnDoubleBack: true,
    exitDelay: 2000,
  },
};
```

## 🔒 Security and Privacy Customization

### Privacy Settings

```typescript
// src/config/PrivacyConfig.ts - Privacy customization options
export interface PrivacyConfig {
  dataCollection: {
    analytics: boolean;
    crashReporting: boolean;
    performanceMetrics: boolean;
    usageStatistics: boolean;
  };
  
  dataStorage: {
    encryptLocalData: boolean;
    automaticBackup: boolean;
    cloudSync: boolean;
    dataRetentionDays: number;
  };
  
  features: {
    allowScreenshots: boolean;
    allowScreenRecording: boolean;
    requireBiometricAuth: boolean;
    sessionTimeout: number; // minutes
  };
}

export const defaultPrivacyConfig: PrivacyConfig = {
  dataCollection: {
    analytics: false,        // Privacy-first approach
    crashReporting: true,    // Help improve stability
    performanceMetrics: false,
    usageStatistics: false,
  },
  
  dataStorage: {
    encryptLocalData: true,
    automaticBackup: false,
    cloudSync: false,
    dataRetentionDays: 30,
  },
  
  features: {
    allowScreenshots: true,
    allowScreenRecording: false,
    requireBiometricAuth: false,
    sessionTimeout: 60,     // 1 hour
  },
};
```

## 🚀 Deployment Customization

### Build Configuration

```typescript
// build-config.js - Custom build configurations
module.exports = {
  development: {
    bundleId: 'com.yourcompany.reactnativellm.dev',
    appName: 'ReactNativeLLM Dev',
    enableDebugFeatures: true,
    minifyEnabled: false,
  },
  
  staging: {
    bundleId: 'com.yourcompany.reactnativellm.staging',
    appName: 'ReactNativeLLM Staging',
    enableDebugFeatures: true,
    minifyEnabled: true,
  },
  
  production: {
    bundleId: 'com.yourcompany.reactnativellm',
    appName: 'ReactNativeLLM',
    enableDebugFeatures: false,
    minifyEnabled: true,
  },
};
```

---

*Customization makes ReactNativeLLM truly yours - tailored to your specific needs and preferences!* 🎨⚙️