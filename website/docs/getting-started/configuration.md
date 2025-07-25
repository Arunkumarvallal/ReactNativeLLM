# Configuration

Learn how to configure ReactNativeLLM for your specific needs.

## 📋 Configuration Overview

ReactNativeLLM offers several configuration options to customize behavior, performance, and user experience.

## 🔧 Context System Configuration

### Default Configuration

The context system uses configuration from `src/config/ContextConfig.ts`:

```typescript
export const DEFAULT_MCP_CONFIG: MCPContextConfig = {
  contextFilePath: 'context.md',
  maxContextTokens: 4000,
  relevanceThreshold: 0.05,
  enableContextInjection: true,
  contextCheckInterval: 5000,
};
```

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `contextFilePath` | `'context.md'` | Name of the context file in documents directory |
| `maxContextTokens` | `4000` | Maximum tokens to include in context |
| `relevanceThreshold` | `0.05` | Minimum relevance score for context inclusion |
| `enableContextInjection` | `true` | Whether to inject context into conversations |
| `contextCheckInterval` | `5000` | Interval (ms) for file change detection |

### Context Processing Constants

```typescript
export const CONTEXT_CONSTANTS = {
  CHUNK_SIZE: 500,           // Maximum tokens per chunk
  CHUNK_OVERLAP: 50,         // Overlap between chunks
  MIN_KEYWORD_LENGTH: 3,     // Minimum keyword length
  MAX_CHUNKS_PER_QUERY: 5,   // Maximum chunks per query
};
```

## 🎨 Theme Configuration

### Theme Options

Themes are defined in `src/theme/theme.ts`:

```typescript
// Light theme colors
export const lightTheme = {
  background: '#fff',
  text: '#000',
  accent: '#34C759',
  // ... more colors
};

// Dark theme colors  
export const darkTheme = {
  background: '#121212',
  text: '#fff',
  accent: '#34C759',
  // ... more colors
};
```

### Customizing Themes

To customize themes:

1. **Edit Theme Files**: Modify color values in `theme.ts`
2. **Add New Properties**: Extend the theme interface
3. **Update Components**: Use new theme properties in components

Example custom theme property:
```typescript
export const lightTheme = {
  // ... existing properties
  customButton: '#FF6B6B',
  customBackground: '#F8F9FA',
};
```

## ⚙️ App Constants

Core app constants are defined in `src/utils/constants.ts`:

### User and Bot Configuration
```typescript
export const AI_BOT = {
  _id: 2,
  name: 'AI Chat Bot',
};

export const USER = {
  _id: 1,
  name: 'You',
  avatar: 'user',
};
```

### UI Constants
```typescript
export const AVATAR_SIZE = 36;
export const AVATAR_RADIUS = 18;
```

### Model Configuration
```typescript
export const DOWNLOADED_MODELS_DIR = 'downloaded_models';
export const MODEL_CONFIG_PATH = (modelId: string) => 
  `bundle/${modelId}/mlc-chat-config.json`;
```

### LLM Generation Settings
```typescript
export const LLM_GENERATION_CONFIG = {
  temperature: 0.6,
};
```

## 📱 Platform Configuration

### iOS Configuration (`ios/`)

#### Info.plist Settings
- App name and bundle identifier
- Permissions for file access
- Background execution capabilities

#### Privacy Settings
```xml
<key>NSDocumentsFolderUsageDescription</key>
<string>This app needs access to documents to store AI models and context files</string>
```

### Android Configuration (`android/`)

#### Permissions (`AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

#### Network Security Config
```xml
<application
  android:usesCleartextTraffic="true"
  android:networkSecurityConfig="@xml/network_security_config">
```

## 🔄 Runtime Configuration

### Environment Variables

You can use environment variables for configuration:

```bash
# Development
export RN_LLM_DEBUG=true
export RN_LLM_LOG_LEVEL=verbose

# Production
export RN_LLM_DEBUG=false
export RN_LLM_LOG_LEVEL=error
```

### Dynamic Configuration

Some settings can be configured at runtime:

```typescript
// In your app code
import { DEFAULT_MCP_CONFIG } from './config/ContextConfig';

// Modify context configuration
const customConfig = {
  ...DEFAULT_MCP_CONFIG,
  maxContextTokens: 6000,        // Increase context size
  relevanceThreshold: 0.1,       // Higher relevance threshold
};
```

## 🎛️ Advanced Configuration

### Model-Specific Settings

Configure different settings per model:

```typescript
const modelConfigs = {
  'llama-2-7b': {
    temperature: 0.7,
    maxTokens: 2048,
  },
  'mistral-7b': {
    temperature: 0.6,
    maxTokens: 4096,
  },
};
```

### Performance Tuning

#### Memory Management
```typescript
// Adjust chunk sizes for performance
const PERFORMANCE_CONFIG = {
  SMALL_DEVICE: {
    CHUNK_SIZE: 300,
    MAX_CHUNKS_PER_QUERY: 3,
  },
  LARGE_DEVICE: {
    CHUNK_SIZE: 800,
    MAX_CHUNKS_PER_QUERY: 8,
  },
};
```

#### Processing Optimization
```typescript
// Adjust processing intervals
const OPTIMIZATION_CONFIG = {
  contextCheckInterval: 10000,    // Less frequent checks
  debounceDelay: 500,            // Input debouncing
  maxConcurrentRequests: 1,      // Limit concurrent processing
};
```

## 🛠️ Development Configuration

### Debug Settings

Enable debug features during development:

```typescript
const DEBUG_CONFIG = {
  enableConsoleLogging: __DEV__,
  showPerformanceMetrics: __DEV__,
  enableContextDebug: __DEV__,
};
```

### Testing Configuration

Configure for testing environments:

```typescript
const TEST_CONFIG = {
  useMockModels: true,
  skipModelDownload: true,
  enableFastMode: true,
};
```

## 📁 File System Configuration

### Storage Locations

The app uses specific directories for different file types:

```typescript
// Model storage
const modelDir = `${RNFS.DocumentDirectoryPath}/models`;

// Context files
const contextDir = `${RNFS.DocumentDirectoryPath}`;

// Cache directory
const cacheDir = `${RNFS.CachesDirectoryPath}/llm-cache`;
```

### File Permissions

Ensure proper file permissions:

```typescript
// iOS: App Sandbox permissions automatically handled
// Android: Storage permissions in AndroidManifest.xml
```

## 🔒 Security Configuration

### Data Protection

Configure data protection levels:

```typescript
const SECURITY_CONFIG = {
  encryptLocalData: false,       // Enable for sensitive data
  allowBackgroundExecution: true,
  requireDeviceAuth: false,      // Biometric authentication
};
```

## 📊 Monitoring Configuration

### Analytics and Logging

Configure monitoring and analytics:

```typescript
const MONITORING_CONFIG = {
  enableCrashReporting: !__DEV__,
  enableAnalytics: false,        // Privacy-focused
  logLevel: __DEV__ ? 'debug' : 'error',
};
```

## 🔄 Configuration Updates

### Hot Reloading

Some configurations support hot reloading during development:

- Theme changes
- Context settings
- Debug flags

### Production Updates

For production apps, configuration changes require:

1. **App Update**: For native configuration changes
2. **Bundle Update**: For JavaScript configuration changes
3. **Remote Config**: If implemented for dynamic updates

---

*Proper configuration ensures optimal performance and user experience!* ⚙️