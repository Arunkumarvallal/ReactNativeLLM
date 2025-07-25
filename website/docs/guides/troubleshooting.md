# Troubleshooting

Common issues and solutions for ReactNativeLLM development and usage.

## 🚨 Installation Issues

### Node.js and Dependencies

#### Node Version Compatibility
```bash
# Check Node.js version
node --version

# Required: Node.js 16+ 
# If using older version:
nvm install 18
nvm use 18
```

#### Package Installation Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use yarn if npm fails
npm install -g yarn
yarn install
```

#### iOS Pod Installation Issues
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clear pod cache
cd ios
pod cache clean --all
rm -rf Pods Podfile.lock
pod install
cd ..
```

### React Native CLI Issues

#### Command Not Found
```bash
# Install React Native CLI globally
npm install -g @react-native-community/cli

# Or use npx
npx react-native --version
```

#### Metro Bundler Issues
```bash
# Reset Metro cache
npm start -- --reset-cache

# Or manually clear
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
```

## 📱 Platform-Specific Issues

### iOS Issues

#### Xcode Build Failures
```bash
# Clean Xcode build
cd ios
xcodebuild clean
cd ..

# Reset iOS simulator
xcrun simctl erase all

# Update Xcode command line tools
xcode-select --install
```

#### Simulator Issues
```bash
# List available simulators
xcrun simctl list devices

# Reset specific simulator
xcrun simctl erase "iPhone 14"

# Boot simulator manually
xcrun simctl boot "iPhone 14"
```

#### Code Signing Issues
1. **Open Xcode project**: `ios/ReactNativeLLM.xcworkspace`
2. **Select project** in navigator
3. **Go to Signing & Capabilities**
4. **Select your development team**
5. **Ensure bundle identifier is unique**

#### Build Errors with Native Modules
```bash
# Reinstall pods with fresh cache
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Android Issues

#### SDK/NDK Issues
```bash
# Check Android SDK location
echo $ANDROID_HOME

# Should point to Android SDK directory
# If not set:
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
export ANDROID_HOME=$HOME/Android/Sdk          # Linux
```

#### Emulator Not Starting
```bash
# List available AVDs
emulator -list-avds

# Start emulator manually
emulator -avd Pixel_4_API_30

# Check emulator status
adb devices
```

#### Gradle Build Issues
```bash
# Clean Gradle build
cd android
./gradlew clean
cd ..

# Clear Gradle cache
rm -rf ~/.gradle/caches/
```

#### Permission Issues
```xml
<!-- Add to android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 🤖 Model-Related Issues

### Model Download Problems

#### Network Connectivity
```bash
# Test internet connection
ping google.com

# Check if behind corporate firewall
curl -I https://huggingface.co
```

#### Storage Space Issues
```bash
# Check available space (iOS Simulator)
xcrun simctl spawn booted df -h

# Check available space (Android)
adb shell df -h
```

#### Download Interruption
- **Restart the app** and try downloading again
- **Check Wi-Fi stability** - switch to cellular if needed
- **Free up storage space** - models can be 2-8GB each

#### Model Verification Failures
```typescript
// Check if model files exist
const modelExists = await RNFS.exists(
  `${RNFS.DocumentDirectoryPath}/bundle/${modelId}/mlc-chat-config.json`
);
console.log('Model exists:', modelExists);
```

### Model Performance Issues

#### Slow Model Loading
- **Restart the app** to clear memory
- **Use smaller models** on older devices
- **Ensure sufficient RAM** (4GB+ recommended)

#### Model Crashes
```bash
# Check device logs for crashes
# iOS
xcrun simctl spawn booted log stream --predicate 'eventMessage contains "ReactNativeLLM"'

# Android  
adb logcat | grep ReactNativeLLM
```

#### Out of Memory Errors
- **Use smaller models** (1-3B parameters instead of 7B+)
- **Close other apps** to free memory
- **Restart device** if memory is fragmented

## 💬 Chat Interface Issues

### Messages Not Appearing

#### Model Preparation Issues
```typescript
// Check model preparation status
console.log('Model preparing:', preparing);
console.log('Model prepared:', prepared);
```

#### Context Integration Problems
```typescript
// Debug context status
console.log('Context enabled:', contextEnabled);
console.log('Context available:', contextAvailable);
console.log('Context manager initialized:', MCPContextManager.isInitialized);
```

#### Theme Rendering Issues
```typescript
// Check theme consistency
const { theme } = useTheme();
console.log('Current theme:', theme === darkTheme ? 'dark' : 'light');
console.log('Text color:', theme.text);
console.log('Background color:', theme.background);
```

### Input Field Issues

#### Keyboard Not Appearing
```typescript
// Force focus on input field
<Composer
  {...props}
  textInputProps={{
    autoFocus: true,
    blurOnSubmit: false,
  }}
/>
```

#### Text Not Sending
- **Check for empty messages** - ensure text is not just whitespace
- **Verify model is ready** - wait for "Model ready" message
- **Restart the app** if input becomes unresponsive

### Performance Issues

#### Slow Scrolling
```typescript
// Optimize message rendering
const MemoizedMessage = React.memo(MessageComponent);

// Limit message history
const MAX_MESSAGES = 100;
const limitedMessages = messages.slice(0, MAX_MESSAGES);
```

#### Memory Leaks
```typescript
// Ensure proper cleanup
useEffect(() => {
  return () => {
    // Cleanup subscriptions, timers, etc.
    MCPContextManager.cleanup();
  };
}, []);
```

## 🗂️ File System Issues

### Context File Problems

#### File Not Found
```bash
# Check if context.md exists in documents directory
# Path: App Documents Directory/context.md
```

#### File Access Permissions
```typescript
// Test file system access
try {
  const documentPath = RNFS.DocumentDirectoryPath;
  console.log('Documents directory:', documentPath);
  
  const files = await RNFS.readDir(documentPath);
  console.log('Files in documents:', files.map(f => f.name));
} catch (error) {
  console.error('File system error:', error);
}
```

#### Context Not Loading
```typescript
// Debug context loading
console.log('Context file path:', ContextFileManager.getContextFilePath());
const contextExists = await ContextFileManager.checkContextFileExists();
console.log('Context file exists:', contextExists);
```

### Storage Issues

#### Insufficient Space
- **Check available storage** on device
- **Delete unused models** to free space
- **Clear app cache** if available

#### File Corruption
```bash
# Reset app data (iOS)
xcrun simctl spawn booted defaults delete com.reactnativellm

# Reset app data (Android)
adb shell pm clear com.reactnativellm
```

## 🎨 Theme and UI Issues

### Theme Not Applying

#### Context Provider Missing
```typescript
// Ensure ThemeProvider wraps the app
<ThemeProvider>
  <App />
</ThemeProvider>
```

#### Theme Hook Usage
```typescript
// Correct usage
const { theme } = useTheme();
style={{ color: theme.text }}

// Incorrect - don't hardcode colors
style={{ color: '#000000' }}
```

### Layout Issues

#### Safe Area Problems
```typescript
// Use SafeAreaView for proper layout
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
  {/* Content */}
</SafeAreaView>
```

#### Keyboard Overlapping Content
```typescript
// Use KeyboardAvoidingView
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  {/* Content */}
</KeyboardAvoidingView>
```

## 🔧 Development Issues

### Hot Reload Not Working

#### Metro Configuration
```javascript
// metro.config.js
module.exports = {
  resetCache: true,
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'png', 'json'],
  },
};
```

#### Watchman Issues (macOS)
```bash
# Reset watchman
watchman watch-del-all

# Restart watchman
brew services restart watchman
```

### TypeScript Errors

#### Module Resolution
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

#### Missing Type Declarations
```bash
# Install missing types
npm install --save-dev @types/react-native
npm install --save-dev @types/uuid
```

### Build Errors

#### Native Module Linking
```bash
# For React Native 0.60+, auto-linking should work
# If manual linking needed:
npx react-native unlink <library-name>
npx react-native link <library-name>
```

#### Version Conflicts
```bash
# Check for version conflicts
npm ls react-native
npm ls react

# Update to compatible versions
npm update
```

## 🐛 Debugging Techniques

### Enable Debug Mode

```typescript
// Add debug logging
const DEBUG = __DEV__;

if (DEBUG) {
  console.log('Debug info:', debugData);
}
```

### React Native Debugger

```bash
# Install React Native Debugger
brew install --cask react-native-debugger

# Or download from GitHub
# https://github.com/jhen0409/react-native-debugger
```

### Remote Debugging

```typescript
// Enable remote debugging in app
if (__DEV__) {
  import('./reactotron-config').then(() => console.log('Reactotron Configured'));
}
```

### Performance Monitoring

```typescript
// Monitor performance
import { performance } from 'perf_hooks';

const startTime = performance.now();
// ... code to measure
const endTime = performance.now();
console.log(`Execution time: ${endTime - startTime}ms`);
```

## 📞 Getting Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing GitHub issues**
3. **Check React Native documentation**
4. **Verify your environment setup**

### Where to Get Help

#### Official Channels
- **React Native Documentation**: https://reactnative.dev/docs/troubleshooting
- **React Native GitHub Issues**: https://github.com/facebook/react-native/issues

#### Community
- **Stack Overflow**: Tag with `react-native` and `reactnativellm`
- **Reddit**: r/reactnative
- **Discord**: React Native Community Discord

#### Project-Specific
- **GitHub Issues**: https://github.com/your-username/ReactNativeLLM/issues
- **Discussions**: https://github.com/your-username/ReactNativeLLM/discussions

### Creating Bug Reports

Include the following information:

```markdown
## Environment
- OS: [iOS/Android version]
- Device: [iPhone 14, Pixel 4, etc.]
- React Native: [version]
- Node.js: [version]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior  
What actually happens

## Logs
```
[Include relevant console logs]
```

## Screenshots
[If applicable]
```

## 🔮 Prevention Tips

### Regular Maintenance

```bash
# Weekly maintenance routine
npm audit && npm audit fix
cd ios && pod update && cd ..
npm run test
```

### Environment Consistency

```bash
# Use .nvmrc for Node version consistency
echo "18" > .nvmrc

# Document dependencies
npm run doctor  # If available
```

### Backup Important Data

- **Context files**: Backup your `context.md`
- **Chat history**: Export important conversations
- **Development settings**: Document your configuration

---

*Effective troubleshooting gets you back to building amazing AI experiences quickly!* 🔧🚀