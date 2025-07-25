# Context System

Learn how ReactNativeLLM's intelligent context system enhances AI conversations with personalized information.

## 🧠 What is the Context System?

The Context System allows you to provide background information to AI models through markdown files. This enables personalized, relevant responses based on your specific context, preferences, and information.

### Key Benefits

- **Personalized Responses**: AI understands your background and preferences
- **Project-Aware**: Include information about your current projects
- **Skill-Based**: AI knows your technical skills and experience level
- **Privacy-First**: Context stays on your device
- **File-Based**: Simple markdown file management

## 📁 Context File Format

### Location
The context file is stored as `context.md` in your app's documents directory:
```
App Documents Directory/context.md
```

### Format
The context file uses standard Markdown format with sections:

```markdown
# My Personal Knowledge Base

## About Me
I'm a React Native developer with 3 years of experience...

## Current Project  
I'm building ReactNativeLLM - a mobile app that allows users to chat with AI models locally...

## Technical Stack
- React Native with TypeScript
- react-native-ai for local LLM inference
- Phosphor React Native for icons

## Preferences
- I prefer clean, minimal user interfaces
- I like using semantic variable names
- I always add proper error handling

## Goals
- Learn about MCP (Model Context Protocol) integration
- Improve the user experience of mobile AI apps
```

## 🎯 How Context Works

### Context Processing Pipeline

1. **File Detection**: App checks for `context.md` in documents directory
2. **Content Processing**: Markdown is parsed and chunked for processing
3. **Keyword Extraction**: Important keywords are extracted from each chunk
4. **Query Matching**: User queries are matched against relevant chunks
5. **Context Injection**: Relevant context is added to AI conversation

### Architecture Overview

```typescript
ContextFileManager → ContextProcessor → MCPContextManager → Chat Integration
```

### Real-Time Processing

When you send a message:

1. **Query Analysis**: Your message is analyzed for keywords
2. **Relevance Scoring**: Context chunks are scored for relevance  
3. **Context Selection**: Most relevant chunks are selected
4. **Prompt Enhancement**: Context is added to your message
5. **AI Response**: AI responds with contextual awareness

## 🔧 Context Controls

### Context Toggle

The database icon in the chat header controls context:

- **Enabled** (filled icon): Context is active
- **Disabled** (outline icon): Context is inactive
- **Unavailable** (grayed out): No context file found

### Manual Refresh

The refresh button manually reloads context from file:

- **When to Use**: After editing `context.md`
- **What it Does**: Re-processes the entire context file
- **Status Update**: Context availability is updated

### Context Status Indicator

The model selection screen shows context status:

- **"Context file detected"**: `context.md` found and processed
- **"No context file found"**: No context file in documents directory

## 📝 Creating Context Files

### Method 1: Test Context (Quick Start)

Long-press the context toggle to create a sample context file:

```typescript
// Creates a test context with sample information
await TestContextHelper.createTestContextFile();
```

### Method 2: Manual Creation

1. **Access Documents Directory**: Use a file manager app
2. **Create File**: Create `context.md` in the app's documents folder  
3. **Add Content**: Write your personal information in Markdown
4. **Refresh**: Tap the refresh button in the app

### Method 3: File Transfer

1. **Create on Computer**: Write `context.md` on your computer
2. **Transfer to Device**: Use AirDrop, email, or file sharing
3. **Move to App Directory**: Place in the app's documents folder

## 🎨 Context File Best Practices

### Structure Your Content

Use clear section headers:

```markdown
# Personal Knowledge Base

## About Me
Personal background and experience

## Current Projects
What you're working on now

## Technical Skills
Programming languages, frameworks, tools

## Preferences  
Your coding style and preferences

## Goals
What you want to learn or achieve

## Notes
Additional context and reminders
```

### Content Guidelines

#### Be Specific
```markdown
❌ I like programming
✅ I'm a React Native developer with 3 years of experience building mobile apps
```

#### Include Examples
```markdown
## Coding Style
I prefer functional components with hooks:
```tsx
const MyComponent: React.FC = () => {
  const [state, setState] = useState('');
  return <View>...</View>;
};
```
```

#### Update Regularly
- Add new projects and skills
- Update current focus areas
- Remove outdated information

### Size Considerations

- **Optimal Size**: 2-10KB for best performance
- **Maximum Chunks**: System processes up to 5 chunks per query
- **Keyword Density**: Include relevant keywords naturally

## ⚙️ Configuration Options

### Context Constants

```typescript
export const CONTEXT_CONSTANTS = {
  CHUNK_SIZE: 500,              // Maximum tokens per chunk
  CHUNK_OVERLAP: 50,            // Overlap between chunks  
  MIN_KEYWORD_LENGTH: 3,        // Minimum keyword length
  MAX_CHUNKS_PER_QUERY: 5,      // Maximum chunks per query
};
```

### MCP Configuration

```typescript
export const DEFAULT_MCP_CONFIG = {
  contextFilePath: 'context.md',      // Context file name
  maxContextTokens: 4000,             // Maximum context tokens
  relevanceThreshold: 0.05,           // Minimum relevance score
  enableContextInjection: true,       // Enable context system
  contextCheckInterval: 5000,         // File check interval (ms)
};
```

## 🔍 Context in Action

### Example Conversation Without Context

```
User: How should I structure my React Native app?
AI: For React Native apps, you typically want to organize your code into folders like components, screens, services...
```

### Example Conversation With Context

```
Context: I'm building ReactNativeLLM with TypeScript, using react-native-ai for local LLM inference...

User: How should I structure my React Native app?
AI: Since you're building ReactNativeLLM with TypeScript and react-native-ai, I'd recommend organizing your codebase similar to what you're already doing. Based on your context, you could structure it like:

- src/components/ for reusable UI components
- src/hooks/ for custom hooks like your useModelDownload
- src/services/ for business logic like your ContextManager
- src/types/ for TypeScript definitions

This matches the pattern you're using for context integration and model management.
```

## 🛠️ Technical Implementation

### Context Processing

The system processes context through multiple stages:

```typescript
// 1. File Reading
const contextDoc = await ContextFileManager.readContextFile();

// 2. Content Chunking  
const chunks = ContextProcessor.processContextContent(content);

// 3. Keyword Extraction
const keywords = extractKeywords(chunkContent);

// 4. Relevance Scoring
const relevantChunks = extractRelevantChunks(userQuery, chunks);

// 5. Prompt Building
const contextPrompt = buildContextPrompt(userQuery, relevantChunks);
```

### Integration with Chat

Context is automatically integrated when enabled:

```typescript
// Context is added to user message before sending to AI
if (contextEnabled && contextAvailable && getContextForQuery) {
  contextContent = await getContextForQuery(userQuery);
  currentUserContent = `${contextContent}\n\nUser Question: ${userQuery}`;
}
```

## 🔄 Context Lifecycle

### Initialization
1. App starts
2. `MCPContextManager.initialize()` called
3. Context file existence checked
4. If found, content is processed into chunks

### Runtime
1. User sends message
2. Context relevance calculated
3. Best chunks selected
4. Context injected into prompt
5. AI generates response with context awareness

### Updates
1. User modifies `context.md`
2. Manual refresh triggered
3. File re-read and re-processed
4. New chunks available for queries

## 🚨 Troubleshooting

### Context Not Working

**Check Context Status**
- Look for context indicator in model selection
- Verify toggle button is enabled (filled icon)

**Verify File Location**
- Ensure `context.md` is in app documents directory
- Check file permissions and accessibility

**Refresh Context**
- Tap refresh button after file changes
- Restart app if context still not detected

### Poor Context Relevance

**Improve Keywords**
- Use specific terms relevant to your queries
- Include synonyms and related terms
- Structure content with clear sections

**Optimize Chunk Size**
- Break large sections into smaller chunks
- Use headers to create logical boundaries
- Avoid very long paragraphs

### Performance Issues

**Reduce Context Size**
- Remove outdated or irrelevant information
- Focus on most important context
- Consider multiple smaller files (future feature)

**Check File Size**
- Keep context file under 50KB for best performance
- Large files may slow down processing

## 🔮 Future Enhancements

Planned improvements to the context system:

- **Multiple Files**: Support for multiple context files
- **Dynamic Context**: Context that changes based on current screen
- **Context Templates**: Pre-built templates for different use cases
- **Visual Editor**: In-app context file editing
- **Context Analytics**: Understanding which context is most useful

---

*The Context System makes your AI conversations more personal and relevant!* 📚🤖