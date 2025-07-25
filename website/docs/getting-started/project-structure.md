# Project Structure

Understanding the ReactNativeLLM codebase organization and architecture.

## 📁 Directory Overview

```
ReactNativeLLM/
├── src/                          # Main source code
│   ├── components/              # Reusable UI components
│   ├── screens/                 # Screen components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # Business logic services
│   ├── theme/                   # Theme system
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions and constants
│   ├── config/                  # Configuration files
│   └── navigation/              # Navigation setup (if needed)
├── android/                     # Android-specific code
├── ios/                         # iOS-specific code
├── docs/                        # Project documentation
├── website/                     # Docusaurus documentation site
└── Configuration files          # Package.json, babel, metro, etc.
```

## 🏗️ Source Code Architecture

### Components (`src/components/`)

Reusable UI components used across the application:

- **`ChatHeader.tsx`** - Chat screen header with controls
- **`ContextToggleButton.tsx`** - Context enable/disable button
- **`ContextStatusIndicator.tsx`** - Context availability indicator
- **`CustomGiftedChat.tsx`** - Customized chat interface
- **`ModelSelection.tsx`** - Model list and download interface
- **`NetworkInfo.tsx`** - Network connectivity display
- **`ThemeToggleButton.tsx`** - Theme switching button

### Screens (`src/screens/`)

Top-level screen components:

- **`ModelSelectionScreen.tsx`** - Model management and selection
- **`ChatScreen.tsx`** - Main chat interface
- **`ChatScreenStore.ts`** - In-memory state management

### Hooks (`src/hooks/`)

Custom React hooks for state management and side effects:

- **`useChatMessages.ts`** - Chat message handling and AI integration
- **`useChatScreenState.ts`** - Screen state persistence
- **`useContextManager.ts`** - Context system management
- **`useModelDownload.ts`** - Model download and management
- **`useModelPreparation.ts`** - Model initialization and preparation

### Services (`src/services/`)

Business logic and external integrations:

- **`ContextFileManager.ts`** - File system operations for context
- **`ContextProcessor.ts`** - Context parsing and processing
- **`MCPContextManager.ts`** - Main context management system
- **`TestContextHelper.ts`** - Development utilities for context

### Theme (`src/theme/`)

Theme system for UI customization:

- **`ThemeContext.tsx`** - React context for theme management
- **`theme.ts`** - Theme definitions and color schemes

### Types (`src/types/`)

TypeScript type definitions:

- **`ContextTypes.ts`** - Context system type definitions

### Utils (`src/utils/`)

Utility functions and constants:

- **`constants.ts`** - Application-wide constants

### Config (`src/config/`)

Configuration files:

- **`ContextConfig.ts`** - Context system configuration

## 🔄 Data Flow

### Model Management Flow
```
ModelSelectionScreen → useModelDownload → react-native-ai → Device Storage
```

### Chat Flow
```
ChatScreen → useChatMessages → AI Model → Context System → UI Update
```

### Context Flow
```
Markdown File → ContextFileManager → ContextProcessor → MCPContextManager → Chat Integration
```

## 🎯 Key Design Patterns

### Custom Hooks Pattern
Each major feature is implemented as a custom hook:
- Encapsulates state and side effects
- Provides clean interface to components
- Enables easy testing and reusability

### Service Layer Pattern
Business logic is separated into service classes:
- Single responsibility principle
- Easy mocking for tests
- Clear separation of concerns

### Context Provider Pattern
Theme and other global state use React Context:
- Avoids prop drilling
- Centralized state management
- Easy access from any component

### Singleton Pattern
Services like `MCPContextManager` use singleton pattern:
- Single instance across app
- Maintains state between screen transitions
- Resource management

## 📱 Platform-Specific Code

### iOS (`ios/`)
- Native iOS project configuration
- CocoaPods dependencies
- iOS-specific permissions and settings

### Android (`android/`)
- Native Android project configuration
- Gradle build system
- Android-specific permissions and settings

## 🔧 Configuration Files

### Package Management
- **`package.json`** - Node.js dependencies and scripts
- **`yarn.lock`** / **`package-lock.json`** - Dependency lock files

### Build Configuration
- **`metro.config.js`** - Metro bundler configuration
- **`babel.config.js`** - Babel transpilation settings
- **`tsconfig.json`** - TypeScript compiler settings

### React Native
- **`index.js`** - Application entry point
- **`app.json`** - React Native app configuration

## 🧪 Testing Structure

The project supports testing with:
- **`__tests__/`** - Test files directory
- **`jest.config.js`** - Jest testing framework configuration

## 📚 Documentation

### Project Docs (`docs/`)
- Context system documentation
- Feature specifications
- Development plans

### Website (`website/`)
- Docusaurus documentation site
- API references
- User guides

## 🔍 Navigation Structure

The app uses a simple stack navigation:

```
App.tsx
├── ModelSelectionScreen (Root)
└── ChatScreen (Model-specific)
```

## 💾 Data Storage

### Local Storage
- **Models**: Downloaded to device file system
- **Context Files**: Stored in app documents directory
- **Chat State**: In-memory with persistence hooks

### No External Dependencies
- No cloud storage required
- No user accounts or authentication
- All data remains on device

---

*Understanding the structure helps you navigate and contribute to the codebase effectively!* 🗺️