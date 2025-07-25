# Building and Deployment

Complete guide for building ReactNativeLLM for production and deploying to app stores.

## 🏗️ Build Process Overview

ReactNativeLLM requires special considerations for building due to the large AI model files and native dependencies. This guide covers both development and production builds.

### Build Types

- **Debug Builds**: For development and testing
- **Release Builds**: Optimized for production use
- **Distribution Builds**: For app store submission

## 📱 iOS Build Process

### Prerequisites

- **Xcode** (latest version)
- **Apple Developer Account** (for device testing and App Store)
- **iOS Device** or Simulator (iOS 13.0+)
- **Valid Code Signing Certificate**

### Development Build (iOS)

```bash
# Ensure dependencies are installed
cd ios && pod install && cd ..

# Build for iOS simulator
npm run ios

# Build for specific simulator
npm run ios -- --simulator="iPhone 14 Pro"

# Build for physical device (requires developer account)
npm run ios -- --device
```

### Release Build (iOS)

#### 1. Prepare for Release Build

```bash
# Clean previous builds
cd ios
xcodebuild clean
rm -rf build/
cd ..

# Clear Metro cache
npm start -- --reset-cache
```

#### 2. Xcode Configuration

1. **Open Workspace**: `ios/ReactNativeLLM.xcworkspace`
2. **Select Target**: ReactNativeLLM
3. **Set Build Configuration**: Release
4. **Configure Signing**:
   - Select your development team
   - Ensure bundle identifier is unique
   - Configure provisioning profiles

#### 3. App Store Configuration

**Info.plist Updates**:
```xml
<!-- ios/ReactNativeLLM/Info.plist -->
<key>CFBundleDisplayName</key>
<string>ReactNativeLLM</string>

<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<key>CFBundleVersion</key>
<string>1</string>

<!-- Storage usage description -->
<key>NSDocumentsFolderUsageDescription</key>
<string>This app stores AI models and context files in your documents.</string>

<!-- Network usage description -->
<key>NSNetworkUsageDescription</key>
<string>This app downloads AI models from the internet.</string>
```

#### 4. Build for Archive

```bash
# Build archive from command line
cd ios
xcodebuild archive \
  -workspace ReactNativeLLM.xcworkspace \
  -scheme ReactNativeLLM \
  -configuration Release \
  -archivePath build/ReactNativeLLM.xcarchive

# Or use Xcode GUI
# Product → Archive
```

#### 5. App Store Submission

1. **Open Xcode Organizer**: Window → Organizer
2. **Select Archive**: Choose your build
3. **Distribute App**: Click "Distribute App"
4. **Select Distribution Method**: App Store Connect
5. **Upload to App Store Connect**

### iOS Build Optimization

#### Bundle Size Optimization

```javascript
// metro.config.js - Optimize bundle
module.exports = {
  transformer: {
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
  },
};
```

#### Native Code Optimization

```objc
// ios/ReactNativeLLM/AppDelegate.mm
#ifdef DEBUG
  [bridge setLogLevel:RCTLogLevelInfo];
#else
  [bridge setLogLevel:RCTLogLevelError];
#endif
```

## 🤖 Android Build Process

### Prerequisites

- **Android Studio** (latest version)
- **Android SDK** (API level 21+)
- **Java Development Kit** (JDK 11 or higher)
- **Android Device** or Emulator

### Development Build (Android)

```bash
# Build for Android emulator/device
npm run android

# Build specific variant
npm run android -- --variant=debug
```

### Release Build (Android)

#### 1. Generate Signing Key

```bash
# Navigate to android app directory
cd android/app

# Generate release key
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Move keystore to secure location
mv my-upload-key.keystore ~/.android/
```

#### 2. Configure Gradle

**gradle.properties**:
```properties
# android/gradle.properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****

# Enable optimization
org.gradle.configureondemand=true
org.gradle.daemon=true
org.gradle.parallel=true
android.enableAapt2=false
```

**build.gradle Configuration**:
```gradle
// android/app/build.gradle
android {
    ...
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### 3. Build Release APK

```bash
# Build release APK
cd android
./gradlew assembleRelease

# Generated APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

#### 4. Build App Bundle (AAB)

```bash
# Build App Bundle for Play Store
cd android
./gradlew bundleRelease

# Generated AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

#### 5. Test Release Build

```bash
# Install release APK on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or test App Bundle
bundletool build-apks --bundle=app-release.aab --output=app-release.apks
bundletool install-apks --apks=app-release.apks
```

### Android Optimization

#### ProGuard Configuration

```properties
# android/app/proguard-rules.pro

# Keep react-native-ai classes
-keep class com.reactnativeai.** { *; }

# Keep ML model related classes
-keep class org.mlc.** { *; }

# Keep application classes
-keep class com.reactnativellm.** { *; }

# Optimize but don't obfuscate for debugging
-dontobfuscate
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
```

#### Native Optimization

```gradle
// android/app/build.gradle
android {
    ...
    packagingOptions {
        pickFirst '**/libc++_shared.so'
        pickFirst '**/libjsc.so'
    }
    
    bundle {
        language {
            enableSplit = false
        }
        density {
            enableSplit = true
        }
        abi {
            enableSplit = true
        }
    }
}
```

## 📦 Automated Build Setup

### CI/CD with GitHub Actions

#### iOS Build Action

```yaml
# .github/workflows/ios-build.yml
name: iOS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install iOS dependencies
      run: cd ios && pod install
    
    - name: Build iOS
      run: |
        xcodebuild \
          -workspace ios/ReactNativeLLM.xcworkspace \
          -scheme ReactNativeLLM \
          -configuration Release \
          -destination 'platform=iOS Simulator,name=iPhone 14' \
          build
```

#### Android Build Action

```yaml
# .github/workflows/android-build.yml
name: Android Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build Android
      run: |
        cd android
        ./gradlew assembleRelease
```

### Fastlane Automation

#### iOS Fastlane

```ruby
# ios/fastlane/Fastfile
platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    increment_build_number(xcodeproj: "ReactNativeLLM.xcodeproj")
    build_app(
      workspace: "ReactNativeLLM.xcworkspace",
      scheme: "ReactNativeLLM",
      configuration: "Release"
    )
    upload_to_testflight
  end
  
  desc "Build for App Store"
  lane :release do
    increment_version_number(xcodeproj: "ReactNativeLLM.xcodeproj")
    build_app(
      workspace: "ReactNativeLLM.xcworkspace", 
      scheme: "ReactNativeLLM",
      configuration: "Release"
    )
    upload_to_app_store
  end
end
```

#### Android Fastlane

```ruby
# android/fastlane/Fastfile
platform :android do
  desc "Build and upload to Play Console"
  lane :beta do
    gradle(
      task: "bundleRelease",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: 'internal',
      aab: 'android/app/build/outputs/bundle/release/app-release.aab'
    )
  end
  
  desc "Deploy to Play Store"
  lane :release do
    gradle(
      task: "bundleRelease",
      project_dir: "android/"
    )
    upload_to_play_store(
      track: 'production',
      aab: 'android/app/build/outputs/bundle/release/app-release.aab'
    )
  end
end
```

## 🚀 App Store Submission

### iOS App Store

#### App Store Connect Setup

1. **Create App Record**:
   - Login to App Store Connect
   - Create new app
   - Set bundle ID, name, and primary language

2. **App Information**:
   - App name and subtitle
   - App category: Productivity or Developer Tools
   - Content rights and age rating

3. **Pricing and Availability**:
   - Set to Free (recommended for initial release)
   - Select availability territories

#### App Metadata

**App Description**:
```
ReactNativeLLM brings the power of Large Language Models directly to your mobile device. Chat with AI models completely offline and privately.

Key Features:
• Local AI model execution - no internet required after download
• Privacy-first design - all conversations stay on your device  
• Context-aware conversations with personal information
• Beautiful dark and light themes
• Multiple AI model support
• Offline capability

Perfect for developers, researchers, and privacy-conscious users who want powerful AI capabilities without cloud dependency.
```

**Keywords**: `AI, LLM, chat, offline, privacy, machine learning, developer, local`

**Screenshots**: Capture screens showing:
- Model selection interface
- Chat conversation
- Dark/light theme toggle
- Context integration

#### Review Guidelines Compliance

- **Privacy**: Emphasize local processing
- **Content**: Ensure appropriate content handling
- **Functionality**: All features work as described
- **Performance**: App runs smoothly on target devices

### Android Play Store

#### Play Console Setup

1. **Create App**:
   - Login to Play Console
   - Create new app
   - Set app details and category

2. **Store Listing**:
   - App name and short description
   - Full description and screenshots
   - App icon and feature graphic

3. **Content Rating**:
   - Complete content rating questionnaire
   - Set appropriate age rating

#### App Bundle Upload

1. **Upload AAB**: Upload the generated app-release.aab
2. **Release Notes**: Describe features and improvements
3. **Testing**: Use internal testing track first
4. **Production**: Release to production when ready

## 🔧 Build Optimization

### Bundle Size Reduction

#### JavaScript Bundle

```javascript
// metro.config.js
module.exports = {
  transformer: {
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
  },
  resolver: {
    alias: {
      'react-native-vector-icons': 'react-native-vector-icons/dist',
    },
  },
};
```

#### Asset Optimization

```bash
# Optimize images
npm install -g imageoptim-cli
imageoptim --directory ./assets

# Remove unused assets
npx react-native-asset-resizer
```

### Performance Optimization

#### Native Performance

```typescript
// Enable Hermes (Android)
// android/app/build.gradle
project.ext.react = [
  enableHermes: true
]
```

#### Memory Management

```typescript
// Optimize large lists
import { VirtualizedList, FlatList } from 'react-native';

// Use appropriate list components for large datasets
<FlatList
  data={messages}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

## 📊 Monitoring and Analytics

### Crash Reporting

```bash
# Install crash reporting
npm install @react-native-firebase/crashlytics

# Or use Bugsnag
npm install @bugsnag/react-native
```

### Performance Monitoring

```typescript
// Basic performance monitoring
const performanceMonitor = {
  startTimer: (name: string) => {
    console.time(name);
  },
  endTimer: (name: string) => {
    console.timeEnd(name);
  }
};
```

## 🚨 Common Build Issues

### iOS Issues

#### Code Signing
- **Issue**: "No valid signing identity found"
- **Solution**: Check Apple Developer account and certificates

#### Bundle Size
- **Issue**: App too large for cellular download
- **Solution**: Optimize assets and enable app thinning

### Android Issues

#### Memory Issues
- **Issue**: Out of memory during build
- **Solution**: Increase Gradle heap size

```gradle
# gradle.properties
org.gradle.jvmargs=-Xmx4g -XX:MaxPermSize=512m
```

#### ProGuard Issues
- **Issue**: App crashes after ProGuard optimization
- **Solution**: Add keep rules for essential classes

## 📈 Release Strategy

### Phased Rollout

1. **Internal Testing**: Team and stakeholders
2. **Beta Testing**: Limited external users
3. **Staged Rollout**: Gradual percentage release
4. **Full Release**: 100% availability

### Version Management

```json
// package.json
{
  "version": "1.0.0",
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor", 
    "version:major": "npm version major"
  }
}
```

---

*Successful deployment brings your AI-powered app to users worldwide!* 🚀📱