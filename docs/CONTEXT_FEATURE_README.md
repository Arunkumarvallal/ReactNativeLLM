# Context Integration Feature

## Overview
The ReactNativeLLM app now supports feeding contextual information to the AI models through a simple `context.md` file. This allows the AI to provide more personalized and relevant responses based on your knowledge base.

## How It Works
1. **Create Context File**: Create a `context.md` file in your app's documents directory
2. **Automatic Detection**: The app automatically detects and processes the file
3. **Smart Context**: The AI only uses context when it's relevant to your questions
4. **Toggle Control**: Use the database icon in chat to enable/disable context

## Setup Instructions

### For Testing (Development)
1. **Easy Method**: Long press the context toggle button (database icon) in the chat screen to create a test context file
2. **Manual Method**: Copy content to your device's documents directory as `context.md`
3. **Custom Method**: Create your own `context.md` file with your personal information

### Debug Features (Development Only)
- **Context Toggle Button**: Long press to create test context file when no context is available
- **Manual Refresh Button**: Click the refresh (↻) icon to reload context after file changes
- **Console Logging**: Check React Native logs for detailed context processing information
- **Context Status**: Shows on model selection screen whether context file is detected

### For Real Usage
1. On your mobile device, create a file called `context.md` in the app's documents directory
2. Write any information you want the AI to know about you in markdown format
3. The app will automatically detect and use the file

## File Location
The context file should be placed at:
```
{App Documents Directory}/context.md
```

## Features

### 🔄 **Context Toggle Button**
- **Database Icon (filled)**: Context is enabled and will be used when relevant
- **Database Icon (regular)**: Context is disabled
- **Hidden**: Button only appears when context file is available

### 📍 **Context Status Indicator**
- Shows on the model selection screen
- Indicates whether a context file has been detected
- Provides quick feedback on context availability

### 🧠 **Smart Context Injection**
- Only includes context when relevant to your question
- Processes content into chunks for optimal performance
- Uses keyword matching and semantic analysis

### 🔄 **Manual Context Refresh**
- Manual refresh button (↻) to reload context when file changes
- No automatic polling - saves battery and performance
- Refresh available in both chat screen and model selection screen

### 🔒 **Privacy & Security**
- All processing happens locally on your device
- No data is sent to external servers
- Context file is only read by the app

## Example Context File

```markdown
# My Knowledge Base

## About Me
I'm a software developer with 5 years of experience in React Native...

## Current Projects
Working on a mobile AI chat application...

## Preferences
- I prefer TypeScript over JavaScript
- I like minimal, clean interfaces
- I always add proper error handling

## Technical Skills
- React Native, TypeScript, Node.js
- Mobile app development
- AI/ML integration
```

## How Context is Used

When you ask a question, the app:
1. Analyzes your question for relevant keywords
2. Searches your context file for matching content
3. If relevant context is found, includes it in the AI prompt
4. The AI responds with knowledge of your context

### Example Interaction
**Your Question**: "What's the best way to handle errors in my current project?"

**Context Used**: Information about your current React Native project and error handling preferences

**AI Response**: Tailored advice specific to React Native development with your preferred error handling patterns

## Technical Implementation

### Core Services
- **ContextFileManager**: Handles file operations and monitoring
- **ContextProcessor**: Processes markdown content and calculates relevance
- **MCPContextManager**: Orchestrates context integration with the LLM

### Key Features
- Real-time file monitoring for changes
- Intelligent chunking for large context files
- Relevance scoring to avoid irrelevant context injection
- Memory-efficient caching system

## Troubleshooting

### Context Not Working
1. Check that the file is named exactly `context.md`
2. Ensure the file is in the correct documents directory
3. Verify the file has content and is valid markdown
4. Check that the context toggle is enabled (database icon filled)

### Context Status Shows "No context file found"
1. Verify file location and name
2. Check file permissions
3. Restart the app to refresh file detection

### AI Not Using Context
1. Make sure your question is relevant to your context content
2. Check that context toggle is enabled
3. Try using more specific keywords that match your context

## Future Enhancements
- Support for multiple context files
- Context file editor within the app
- Usage analytics and context effectiveness metrics
- Enhanced semantic search capabilities

## Support
If you encounter issues with the context feature, check the app logs or create an issue in the project repository. 