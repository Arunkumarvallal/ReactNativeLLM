# File Management

Learn how ReactNativeLLM manages files, storage, and data persistence across the application.

## 📁 File System Overview

ReactNativeLLM uses the device's file system for storing AI models, context files, and application data. All data remains local on the device for privacy and offline functionality.

### Storage Locations

The app uses different directories for different types of data:

```typescript
// App Documents Directory (user accessible)
const documentsPath = RNFS.DocumentDirectoryPath;

// App Cache Directory (temporary storage)  
const cachePath = RNFS.CachesDirectoryPath;

// Bundle Directory (app resources)
const bundlePath = RNFS.MainBundlePath;
```

## 🤖 Model File Management

### Model Storage Structure

AI models are stored in a structured format within the app's documents directory:

```
Documents/
├── bundle/
│   ├── llama-2-7b/
│   │   ├── mlc-chat-config.json
│   │   ├── model_weights/
│   │   └── tokenizer/
│   └── mistral-7b/
│       ├── mlc-chat-config.json
│       └── model_files/
└── downloaded_models/
    ├── llama-2-7b
    └── mistral-7b
```

### Model Download Process

```typescript
// Download initiated through react-native-ai
downloadModel(modelId, {
  onStart: () => {
    // Update UI to show download started
  },
  onProgress: (progress) => {
    // Update progress (progress.percentage)
  },
  onComplete: async () => {
    // Create tracking record
    const recordDir = `${RNFS.DocumentDirectoryPath}/downloaded_models`;
    const recordFile = `${recordDir}/${modelId}`;
    
    await RNFS.mkdir(recordDir);
    await RNFS.writeFile(recordFile, 'downloaded', 'utf8');
  },
  onError: (error) => {
    // Handle download errors
  },
});
```

### Model Verification

The app verifies model existence by checking for configuration files:

```typescript
const checkModelExists = async (modelId: string): Promise<boolean> => {
  const modelConfigFile = `${RNFS.DocumentDirectoryPath}/bundle/${modelId}/mlc-chat-config.json`;
  return await RNFS.exists(modelConfigFile);
};
```

## 📝 Context File Management

### Context File System

The `ContextFileManager` service handles context file operations:

```typescript
class ContextFileManager {
  private contextFilePath: string;

  constructor() {
    this.contextFilePath = `${RNFS.DocumentDirectoryPath}/context.md`;
  }

  // Check if context.md exists
  async checkContextFileExists(): Promise<boolean> {
    return await RNFS.exists(this.contextFilePath);
  }

  // Read context file content
  async readContextFile(): Promise<ContextDocument | null> {
    const content = await RNFS.readFile(this.contextFilePath, 'utf8');
    const stats = await RNFS.stat(this.contextFilePath);
    
    return {
      content,
      lastModified: new Date(stats.mtime),
      size: stats.size,
      chunks: [],
      isValid: content.trim().length > 0,
    };
  }
}
```

### Context File Operations

#### Reading Context Files

```typescript
const contextDoc = await ContextFileManager.readContextFile();
if (contextDoc) {
  console.log('Context size:', contextDoc.size);
  console.log('Last modified:', contextDoc.lastModified);
  console.log('Content preview:', contextDoc.content.substring(0, 100));
}
```

#### Context File Metadata

```typescript
const metadata = await ContextFileManager.getFileMetadata();
// Returns: { size, lastModified, path }
```

### Test Context Creation

For development and testing:

```typescript
export class TestContextHelper {
  static async createTestContextFile(): Promise<boolean> {
    const contextFilePath = `${RNFS.DocumentDirectoryPath}/context.md`;
    const testContent = `# My Personal Knowledge Base\n\n## About Me\n...`;
    
    await RNFS.writeFile(contextFilePath, testContent, 'utf8');
    return true;
  }
}
```

## 💾 Data Persistence

### Chat State Storage

Chat messages and model state are persisted in memory and can be extended to file storage:

```typescript
// In-memory storage (current implementation)
const chatScreenStore: Record<string, ChatScreenState> = {};

export function setChatScreenState(modelId: string, state: ChatScreenState) {
  chatScreenStore[modelId] = state;
}

export function getChatScreenState(modelId: string): ChatScreenState | undefined {
  return chatScreenStore[modelId];
}
```

### Persistent Storage Enhancement

For persistent storage across app restarts:

```typescript
// Future enhancement - File-based persistence
const saveChatState = async (modelId: string, state: ChatScreenState) => {
  const statePath = `${RNFS.DocumentDirectoryPath}/chat_states/${modelId}.json`;
  await RNFS.writeFile(statePath, JSON.stringify(state), 'utf8');
};

const loadChatState = async (modelId: string): Promise<ChatScreenState | null> => {
  const statePath = `${RNFS.DocumentDirectoryPath}/chat_states/${modelId}.json`;
  if (await RNFS.exists(statePath)) {
    const content = await RNFS.readFile(statePath, 'utf8');
    return JSON.parse(content);
  }
  return null;
};
```

## 🗂️ File Organization

### Directory Structure

```
App Container/
├── Documents/              # User-accessible files
│   ├── context.md         # Context file
│   ├── bundle/           # AI model files
│   ├── downloaded_models/ # Download tracking
│   └── chat_states/      # Chat persistence (future)
├── Library/
│   ├── Caches/           # Temporary files
│   └── Preferences/      # App preferences
└── tmp/                  # Temporary storage
```

### File Path Constants

```typescript
export const FILE_PATHS = {
  DOCUMENTS: RNFS.DocumentDirectoryPath,
  CACHE: RNFS.CachesDirectoryPath,
  CONTEXT_FILE: `${RNFS.DocumentDirectoryPath}/context.md`,
  MODELS_DIR: `${RNFS.DocumentDirectoryPath}/bundle`,
  DOWNLOADS_TRACKER: `${RNFS.DocumentDirectoryPath}/downloaded_models`,
} as const;
```

## 🔍 File Operations

### Reading Files

```typescript
// Read text files
const readTextFile = async (path: string): Promise<string> => {
  return await RNFS.readFile(path, 'utf8');
};

// Read file with error handling
const safeReadFile = async (path: string): Promise<string | null> => {
  try {
    return await RNFS.readFile(path, 'utf8');
  } catch (error) {
    console.warn('Error reading file:', error);
    return null;
  }
};
```

### Writing Files

```typescript
// Write text files
const writeTextFile = async (path: string, content: string): Promise<void> => {
  await RNFS.writeFile(path, content, 'utf8');
};

// Ensure directory exists before writing
const safeWriteFile = async (path: string, content: string): Promise<boolean> => {
  try {
    const directory = path.substring(0, path.lastIndexOf('/'));
    const dirExists = await RNFS.exists(directory);
    
    if (!dirExists) {
      await RNFS.mkdir(directory);
    }
    
    await RNFS.writeFile(path, content, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
};
```

### File Information

```typescript
// Get file statistics
const getFileInfo = async (path: string) => {
  const stats = await RNFS.stat(path);
  return {
    size: stats.size,
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    lastModified: new Date(stats.mtime),
    created: new Date(stats.ctime),
  };
};
```

## 🧹 Cleanup and Maintenance

### Cache Management

```typescript
// Clean temporary files
const cleanCache = async (): Promise<void> => {
  const cacheDir = RNFS.CachesDirectoryPath;
  const files = await RNFS.readDir(cacheDir);
  
  for (const file of files) {
    if (file.name.startsWith('temp_')) {
      await RNFS.unlink(file.path);
    }
  }
};
```

### Storage Space Monitoring

```typescript
// Check available storage space
const checkStorageSpace = async (): Promise<{ free: number; total: number }> => {
  const { freeSpace, totalSpace } = await RNFS.getFSInfo();
  return {
    free: freeSpace,
    total: totalSpace,
  };
};

// Warn user about low storage
const checkStorageWarning = async (requiredSpace: number): Promise<boolean> => {
  const { free } = await checkStorageSpace();
  return free < requiredSpace;
};
```

## 🔒 Security and Permissions

### File Permissions

The app operates within its own sandbox with appropriate permissions:

#### iOS Permissions
- Files are automatically sandboxed
- Documents directory is backed up to iCloud (can be disabled)
- Cache directory is not backed up

#### Android Permissions

```xml
<!-- In AndroidManifest.xml -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Data Privacy

All files remain within the app's container:
- No access to other app's files
- User documents are protected
- Models and context stay on device

## 🚨 Error Handling

### File Operation Errors

```typescript
const robustFileOperation = async (operation: () => Promise<any>) => {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('File not found');
    } else if (error.code === 'EACCES') {
      console.warn('Permission denied');
    } else if (error.code === 'ENOSPC') {
      console.warn('No space left on device');
    } else {
      console.error('Unknown file error:', error);
    }
    return null;
  }
};
```

### Storage Space Errors

```typescript
const handleStorageError = (error: any) => {
  if (error.code === 'ENOSPC') {
    // Show user-friendly storage warning
    Alert.alert(
      'Storage Full',
      'Not enough space to download model. Please free up space and try again.',
      [{ text: 'OK' }]
    );
  }
};
```

## 📊 File Monitoring

### File Change Detection

```typescript
// Monitor file changes (manual refresh approach)
const checkFileModification = async (path: string, lastKnown: Date): Promise<boolean> => {
  try {
    const stats = await RNFS.stat(path);
    return new Date(stats.mtime) > lastKnown;
  } catch {
    return false;
  }
};
```

### File Size Monitoring

```typescript
// Monitor file sizes for cleanup
const monitorFileSizes = async (): Promise<{ large: string[], total: number }> => {
  const documentsDir = RNFS.DocumentDirectoryPath;
  const files = await RNFS.readDir(documentsDir);
  
  const largeFiles = files
    .filter(file => file.size > 100 * 1024 * 1024) // > 100MB
    .map(file => file.path);
    
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  
  return { large: largeFiles, total: totalSize };
};
```

## 🔮 Future Enhancements

Planned improvements to file management:

- **Cloud Backup**: Optional cloud synchronization
- **File Compression**: Compress large context files
- **Automatic Cleanup**: Clean old models and cache
- **Storage Analytics**: Show storage usage breakdown
- **File Sharing**: Export context files and chat history
- **Encryption**: Optional file encryption for sensitive data

---

*Efficient file management ensures smooth operation and optimal storage usage!* 📁💾