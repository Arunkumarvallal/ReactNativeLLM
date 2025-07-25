# Model Management

Comprehensive guide to downloading, managing, and using AI models in ReactNativeLLM.

## 🧠 Understanding AI Models

ReactNativeLLM supports local execution of Large Language Models (LLMs) using the `react-native-ai` library. Models are downloaded once and stored locally for offline use.

### Model Types

The app supports various model types optimized for mobile devices:

- **Quantized Models**: Compressed for mobile performance
- **Small Models** (1-3B parameters): Fast responses, lower quality
- **Medium Models** (7B parameters): Balanced performance
- **Large Models** (13B+ parameters): High quality, requires powerful devices

## 📥 Model Download Process

### Automatic Model Discovery

The app automatically discovers available models through the `react-native-ai` library:

```typescript
// Models are loaded automatically
const models = await getModels();
```

### Download Interface

The Model Selection Screen provides:

1. **Model List**: Shows all available models
2. **Download Status**: Icons indicate download state
3. **Progress Tracking**: Real-time download progress
4. **Storage Requirements**: Implicit through model size

### Download States

Models can be in one of several states:

| State | Icon | Description |
|-------|------|-------------|
| Not Downloaded | 📥 Download | Model not yet downloaded |
| Downloading | 🔄 Progress% | Download in progress |
| Downloaded | ✅ Checkmark | Ready to use |
| Selected | 🔘 Selected | Currently active model |

## 🔧 Model Management API

### useModelDownload Hook

The `useModelDownload` hook manages all model operations:

```typescript
const {
  availableModels,        // Array of available models
  downloadStatus,         // Download state per model
  selectedModelId,        // Currently selected model
  setSelectedModelId,     // Select a model
  handleDownloadModel,    // Start model download
  atLeastOneDownloaded,   // Boolean: any model downloaded
  canContinue,           // Boolean: can proceed to chat
} = useModelDownload();
```

### Download Implementation

```typescript
const handleDownloadModel = useCallback((model: AiModelSettings) => {
  downloadModel(modelId, {
    onStart: () => {
      // Update UI to show download started
    },
    onProgress: (progress) => {
      // Update progress bar
      setDownloadStatus(prev => ({
        ...prev,
        [modelId]: { 
          ...prev[modelId], 
          progress: progress.percentage,
          downloading: true 
        },
      }));
    },
    onComplete: () => {
      // Mark as downloaded and select
      setDownloadStatus(prev => ({
        ...prev,
        [modelId]: { 
          downloaded: true, 
          progress: 100, 
          downloading: false 
        },
      }));
      setSelectedModelId(modelId);
    },
    onError: () => {
      // Handle download errors
    },
  });
}, []);
```

## 💾 Storage Management

### Storage Locations

Models are stored in the device's file system:

```typescript
// Model configuration files
const modelConfigPath = `${RNFS.DocumentDirectoryPath}/bundle/${modelId}/mlc-chat-config.json`;

// Model tracking
const downloadedModelsDir = `${RNFS.DocumentDirectoryPath}/downloaded_models`;
```

### Storage Requirements

Typical model sizes:

- **Small models**: 1-2 GB
- **Medium models**: 4-6 GB  
- **Large models**: 8-12 GB

### Storage Verification

The app verifies model download status by checking for configuration files:

```typescript
const checkModelExists = async (modelId: string) => {
  const modelConfigFile = `${RNFS.DocumentDirectoryPath}/bundle/${modelId}/mlc-chat-config.json`;
  return await RNFS.exists(modelConfigFile);
};
```

## 🚀 Model Preparation

### Preparation Process

Before first use, models must be prepared:

```typescript
const { preparing, prepared } = useModelPreparation({
  modelId,
  onMessagesUpdate: updateMessages,
});
```

### Preparation States

1. **Preparing**: Model is being loaded into memory
2. **Ready**: Model is prepared and ready for inference
3. **Error**: Preparation failed

### Preparation Messages

The app shows user-friendly messages during preparation:

```typescript
// Preparing message
{
  _id: 'preparing',
  text: 'Preparing model, please wait...',
  user: AI_BOT,
}

// Ready message  
{
  _id: 'ready', 
  text: 'Model ready for conversation!',
  user: AI_BOT,
}
```

## 🎯 Model Selection

### Selection Criteria

Consider these factors when selecting models:

#### Device Performance
- **RAM**: 4GB+ recommended for medium models
- **Storage**: Ensure 2x model size free space
- **CPU**: Newer devices handle larger models better

#### Use Case
- **Quick responses**: Choose smaller models
- **Quality output**: Choose larger models
- **Offline use**: Any downloaded model works

#### Battery Impact
- **Smaller models**: Less battery usage
- **Larger models**: More intensive processing

### Auto-Selection Logic

The app automatically selects the first downloaded model:

```typescript
// Auto-select first downloaded model
const firstDownloaded = models.find(m => 
  m.model_id && downloadStatus[m.model_id]?.downloaded
);
if (firstDownloaded && firstDownloaded.model_id) {
  setSelectedModelId(firstDownloaded.model_id);
}
```

## 🔄 Model Switching

### Runtime Switching

Users can switch between downloaded models:

1. Return to Model Selection Screen
2. Select different downloaded model
3. Navigate back to chat
4. New model prepares automatically

### State Preservation

Each model maintains separate chat state:

```typescript
// Chat state is stored per model
const chatState = getChatScreenState(modelId);
```

## 🛠️ Advanced Features

### Model Information

Access detailed model information:

```typescript
interface AiModelSettings {
  model_id: string;
  name?: string;
  size?: number;
  description?: string;
  // Additional metadata
}
```

### Download Cancellation

Currently, download cancellation is not implemented but the interface exists:

```typescript
const onCancelDownload = (model: AiModelSettings) => {
  // Implementation needed
};
```

### Model Deletion

Model deletion interface exists but requires implementation:

```typescript  
const onDeleteModel = (model: AiModelSettings) => {
  // Implementation needed
};
```

## 🔍 Troubleshooting

### Common Issues

#### Download Failures
- **Solution**: Check internet connectivity and storage space
- **Retry**: Restart app and try download again

#### Model Not Loading
- **Solution**: Verify model files exist
- **Reset**: Delete and re-download model

#### Preparation Timeouts
- **Solution**: Restart app, ensure sufficient RAM
- **Alternative**: Try smaller model

#### Storage Warnings
- **Solution**: Free up device storage
- **Management**: Delete unused models

### Debug Information

Enable debug logging to troubleshoot:

```typescript
console.log('Available models:', availableModels);
console.log('Download status:', downloadStatus);
console.log('Selected model:', selectedModelId);
```

## 📈 Performance Optimization

### Model Selection Strategy
1. **Start Small**: Begin with smaller models
2. **Test Performance**: Evaluate response speed and quality
3. **Upgrade Gradually**: Move to larger models if device handles it well

### Memory Management
- **Single Model**: Only one model active at a time
- **Cleanup**: Models are unloaded when switching
- **Preparation**: Preparation may take 1-2 minutes for large models

### Network Optimization
- **Wi-Fi Only**: Download large models on Wi-Fi
- **Resume Support**: Downloads can resume if interrupted
- **Background Downloads**: Continue downloads when app is backgrounded

---

*Effective model management ensures the best AI experience on your device!* 🧠📱