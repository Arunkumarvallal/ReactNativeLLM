# Quick Start Guide

Get up and running with ReactNativeLLM in just a few minutes!

## 🚀 First Launch

After [installation](../installation.md), launch the app on your device or simulator:

```bash
npm run ios
# or
npm run android
```

## 📱 Initial Setup

### 1. Model Selection Screen

When you first open the app, you'll see the **Model Selection Screen** with:

- A list of available AI models
- Download buttons for each model
- Network connectivity indicator
- Theme toggle button
- Context status indicator

### 2. Download Your First Model

1. **Choose a Model**: Select a model based on your device's capabilities:
   - **Smaller models** (1-2GB): Better for older devices, faster responses
   - **Larger models** (4-8GB): Better quality responses, require more storage

2. **Start Download**: Tap the download icon next to your chosen model
   - Progress will be shown with a percentage indicator
   - Ensure you have stable internet connection
   - Download may take several minutes depending on model size

3. **Model Selection**: Once downloaded, the model will show a green checkmark
   - Tap the model row to select it
   - The "Continue" button will become active

### 3. Enter Chat Interface

1. **Navigate to Chat**: Tap the "Continue" button
2. **Model Preparation**: The model will prepare for first use (1-2 minutes)
3. **Ready to Chat**: You'll see "Model ready for conversation!"

## 💬 Your First Conversation

### Basic Chat
```
User: Hello! Can you help me with React Native development?
AI: Hello! I'd be happy to help you with React Native development...
```

### Using Context (Optional)

The app supports context from markdown files for personalized responses:

1. **Enable Context**: Tap the database icon in the chat header
2. **Create Test Context**: Long-press the context button to create sample context
3. **Enhanced Conversations**: The AI will use your context for personalized responses

## 🎨 Customization

### Theme Switching
- **Automatic**: Follows your device's system theme
- **Manual**: Tap the sun/moon icon to toggle
- **Reset**: Long-press the theme button to return to system default

### Context Management
- **Toggle Context**: Database icon in chat header
- **Refresh Context**: Arrow icon next to context toggle
- **Manual Context**: Place `context.md` file in app documents directory

## 📊 Understanding the Interface

### Model Selection Screen
- **Model List**: Available AI models with download status
- **Network Info**: Wi-Fi connectivity indicator
- **Context Status**: Shows if context file is detected
- **Continue Button**: Enabled when a model is downloaded and selected

### Chat Screen
- **Header**: Model name, context controls, theme toggle, back button
- **Messages**: Conversation history with timestamps
- **Input**: Text input with send button
- **Avatars**: User and AI indicators for each message

## 🔧 Quick Tips

### Performance
- **Model Size**: Smaller models = faster responses
- **Context Length**: Shorter context = faster processing
- **Device Storage**: Keep 1-2GB free space for optimal performance

### Privacy
- **Local Processing**: All conversations happen on your device
- **No Internet**: Chat works offline once models are downloaded
- **Data Storage**: Messages persist until you clear app data

### Troubleshooting
- **Slow Responses**: Try a smaller model or restart the app
- **Download Issues**: Check internet connection and storage space
- **App Crashes**: Ensure sufficient device memory (4GB+ RAM recommended)

## 🎯 Next Steps

Now that you're up and running:

1. **Explore Features**: Learn about [Model Management](../features/model-management.md)
2. **Advanced Usage**: Set up [Context Integration](../features/context-system.md)
3. **Customization**: Configure [Themes](../features/theme-support.md)
4. **Development**: Check out the [API Documentation](../api/components/overview.md)

## 📞 Need Help?

- **Troubleshooting**: See our [Troubleshooting Guide](../guides/troubleshooting.md)
- **Features**: Explore detailed [Feature Documentation](../features/model-management.md)
- **Issues**: Report bugs on [GitHub](https://github.com/your-username/ReactNativeLLM/issues)

---

*Ready to explore the full power of local AI on mobile?* 🤖✨