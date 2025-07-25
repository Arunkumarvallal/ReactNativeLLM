# Installation

This guide will help you set up ReactNativeLLM for development and testing.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (version 16 or higher)
- **React Native development environment**
- **Git**

### Platform-Specific Requirements

#### iOS Development
- **Xcode** (latest version)
- **iOS Simulator** or physical iOS device (iOS 13.0+)
- **CocoaPods** (for iOS dependencies)

#### Android Development
- **Android Studio** (latest version)
- **Android SDK** (API level 21+)
- **Android emulator** or physical Android device

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ReactNativeLLM.git
cd ReactNativeLLM
```

### 2. Install Dependencies

Install Node.js dependencies:

```bash
npm install
# or
yarn install
```

### 3. Platform-Specific Setup

#### iOS Setup

Install iOS dependencies:

```bash
cd ios && pod install && cd ..
```

#### Android Setup

No additional setup required for Android. The gradle dependencies will be installed automatically.

## Running the Application

### Development Mode

#### iOS
```bash
npm run ios
# or
yarn ios
```

#### Android
```bash
npm run android
# or
yarn android
```

### Metro Bundler

Start the Metro development server:

```bash
npm start
# or
yarn start
```

## Verification

After successful installation, you should see:

1. **Model Selection Screen**: The app opens to a screen showing available AI models
2. **Download Interface**: Ability to download AI models (requires internet connection)
3. **Theme Toggle**: Light/dark theme switching works
4. **Navigation**: Smooth transitions between screens

## Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
npm start -- --reset-cache
```

#### iOS Build Issues
```bash
# Clean and rebuild
cd ios
xcodebuild clean
cd ..
npm run ios
```

#### Android Build Issues
```bash
# Clean gradle cache
cd android
./gradlew clean
cd ..
npm run android
```

#### Model Download Issues
- Ensure you have sufficient storage space (2-8GB per model)
- Check internet connectivity
- Verify device storage permissions

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./guides/troubleshooting.md)
2. Review the [GitHub Issues](https://github.com/your-username/ReactNativeLLM/issues)
3. Create a new issue with detailed information about your setup

## Next Steps

Once installation is complete:

1. Follow the [Quick Start Guide](./getting-started/quick-start.md)
2. Explore the [Features Documentation](./features/model-management.md)
3. Review the [API Reference](./api/components/overview.md) for development

---

*Successfully installed ReactNativeLLM? Start chatting with AI models locally!* 🎉