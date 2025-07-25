# Development Setup

Complete guide for setting up a development environment for ReactNativeLLM.

## 🛠️ Prerequisites

### System Requirements

- **macOS** (for iOS development) or **Windows/Linux** (for Android)
- **8GB+ RAM** (16GB recommended for optimal performance)
- **50GB+ free disk space** (for tools, simulators, and models)

### Required Software

#### Node.js and Package Manager
```bash
# Install Node.js (16.x or higher)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify installation
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

#### Git
```bash
# macOS (with Homebrew)
brew install git

# Ubuntu/Debian
sudo apt update && sudo apt install git

# Verify installation
git --version
```

## 📱 Platform Setup

### iOS Development Setup

#### Xcode Installation
1. **Install Xcode** from the Mac App Store (latest version)
2. **Install Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **Accept Xcode License**:
   ```bash
   sudo xcodebuild -license accept
   ```

#### iOS Simulator
1. Open Xcode
2. Go to **Xcode → Preferences → Components**
3. Download desired iOS simulator versions (iOS 13.0+ recommended)

#### CocoaPods
```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify installation
pod --version
```

### Android Development Setup

#### Android Studio Installation
1. **Download Android Studio** from [developer.android.com](https://developer.android.com/studio)
2. **Run the installer** and follow setup wizard
3. **Install Android SDK** (API level 21 or higher)

#### Android SDK Configuration
```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc)
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk        # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Reload shell configuration
source ~/.zshrc  # or ~/.bashrc
```

#### Android Emulator Setup
1. Open Android Studio
2. Go to **Tools → AVD Manager**
3. Create a new virtual device (API level 21+)
4. Download and start the emulator

## 🚀 Project Setup

### Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-username/ReactNativeLLM.git
cd ReactNativeLLM

# Verify React Native CLI
npx react-native --version
```

### Install Dependencies

```bash
# Install Node.js dependencies
npm install

# For iOS: Install pod dependencies
cd ios && pod install && cd ..

# Verify installation
npm run doctor  # If available, checks RN environment
```

### Environment Configuration

#### Metro Configuration
The project includes a `metro.config.js` file. Verify it's configured correctly:

```javascript
// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
```

#### TypeScript Configuration
Verify `tsconfig.json` is properly configured:

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true
  }
}
```

## 🧪 Development Environment

### Running the Development Server

#### Start Metro Bundler
```bash
# Start the Metro development server
npm start

# Or with cache reset
npm start -- --reset-cache
```

#### Run on iOS
```bash
# Run on iOS simulator
npm run ios

# Run on specific iOS simulator
npm run ios -- --simulator="iPhone 14 Pro"

# Run on physical device (requires Apple Developer account)
npm run ios -- --device
```

#### Run on Android
```bash
# Start Android emulator first, then:
npm run android

# Or run directly
npm run android
```

### Development Tools

#### React Native Debugger
```bash
# Install React Native Debugger
brew install --cask react-native-debugger  # macOS

# Or download from GitHub releases
# https://github.com/jhen0409/react-native-debugger/releases
```

#### Flipper (Optional)
```bash
# Download Flipper from
# https://fbflipper.com/
```

## 🔧 IDE Setup

### Visual Studio Code

#### Recommended Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-react-native"
  ]
}
```

#### Workspace Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact"
  }
}
```

#### Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug iOS",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios"
    },
    {
      "name": "Debug Android",
      "type": "reactnative", 
      "request": "launch",
      "platform": "android"
    }
  ]
}
```

## 🧹 Code Quality Tools

### ESLint Configuration

```bash
# Install ESLint and TypeScript rules
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Create .eslintrc.js
echo "module.exports = {
  extends: ['@react-native-community'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
};" > .eslintrc.js
```

### Prettier Configuration

```bash
# Install Prettier
npm install --save-dev prettier

# Create .prettierrc
echo "{
  \"semi\": true,
  \"trailingComma\": \"es5\",
  \"singleQuote\": true,
  \"printWidth\": 100
}" > .prettierrc
```

### Pre-commit Hooks

```bash
# Install Husky for Git hooks
npm install --save-dev husky lint-staged

# Add to package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 🧪 Testing Setup

### Jest Configuration

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Create jest.config.js
echo "module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};" > jest.config.js
```

### Test Scripts

```json
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🔍 Debugging

### Common Debug Commands

```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear React Native cache
npx react-native start --reset-cache

# Clear iOS build cache
cd ios && xcodebuild clean && cd ..

# Clear Android build cache
cd android && ./gradlew clean && cd ..

# Reset npm modules
rm -rf node_modules && npm install
```

### Log Debugging

```bash
# iOS device logs
xcrun simctl spawn booted log stream --predicate 'eventMessage contains "ReactNativeLLM"'

# Android device logs
adb logcat | grep ReactNativeLLM
```

### Performance Monitoring

```typescript
// Add performance monitoring
import { performance } from 'perf_hooks';

const startTime = performance.now();
// ... your code
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

## 🚀 Build Optimization

### Development Builds

```bash
# iOS development build
npm run ios -- --configuration Debug

# Android development build
npm run android -- --variant=debug
```

### Release Builds

```bash
# iOS release build
cd ios && xcodebuild -workspace ReactNativeLLM.xcworkspace -scheme ReactNativeLLM -configuration Release -destination 'platform=iOS Simulator,name=iPhone 14' build

# Android release build
cd android && ./gradlew assembleRelease
```

## 📊 Development Workflow

### Daily Development Routine

1. **Start Development Server**:
   ```bash
   npm start
   ```

2. **Run on Target Platform**:
   ```bash
   npm run ios  # or npm run android
   ```

3. **Make Changes** and hot reload will update automatically

4. **Run Tests**:
   ```bash
   npm test
   ```

5. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Code Organization Tips

- **Components**: Keep components small and focused
- **Hooks**: Extract reusable logic into custom hooks
- **Services**: Separate business logic from UI components
- **Types**: Define TypeScript interfaces for better type safety
- **Constants**: Use constants file for shared values

## 🚨 Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear watchman (macOS)
watchman watch-del-all

# Clear npm cache
npm cache clean --force
```

#### iOS Build Issues
```bash
# Reset iOS simulator
xcrun simctl erase all

# Reinstall pods
cd ios && rm -rf Pods && pod install && cd ..
```

#### Android Build Issues
```bash
# Reset Android emulator
adb devices
adb -s <device-id> shell am force-stop com.reactnativellm

# Clear gradle cache
cd android && ./gradlew clean
```

#### Permission Issues
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Getting Help

1. **Documentation**: Check React Native official docs
2. **Community**: Stack Overflow, Reddit r/reactnative
3. **Issues**: GitHub issues for specific problems
4. **Discord**: React Native community Discord

## 🔮 Advanced Setup

### Custom Development Tools

```bash
# Install useful global tools
npm install -g react-devtools
npm install -g @react-native-community/cli

# Browser debugging
npm install -g react-native-debugger
```

### Performance Profiling

```bash
# Install performance tools
npm install --save-dev @react-native-community/eslint-plugin-metro
npm install --save-dev metro-react-native-babel-preset
```

---

*A well-configured development environment accelerates development and reduces debugging time!* 🚀⚙️