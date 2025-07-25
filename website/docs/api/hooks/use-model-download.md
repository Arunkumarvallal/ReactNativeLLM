# useModelDownload

The `useModelDownload` hook manages AI model discovery, downloading, selection, and storage operations in ReactNativeLLM.

## 📋 Overview

**Location**: `src/hooks/useModelDownload.ts`
**Purpose**: Comprehensive model management functionality

This hook provides a complete interface for managing AI models, from discovering available models to downloading, verifying, and selecting them for use.

## 🎯 Hook Interface

### Parameters

None - the hook manages its own state internally.

### Return Value

```typescript
interface UseModelDownloadReturn {
  availableModels: AiModelSettings[];                          // Array of available models
  downloadStatus: Record<string, DownloadStatus>;             // Download state per model
  selectedModelId: string | null;                             // Currently selected model ID
  setSelectedModelId: (modelId: string | null) => void;       // Select a model
  handleDownloadModel: (model: AiModelSettings) => void;      // Start model download
  atLeastOneDownloaded: boolean;                              // Whether any model is downloaded
  canContinue: boolean;                                       // Whether can proceed to chat
}

interface DownloadStatus {
  downloaded: boolean;    // Whether model is downloaded
  progress: number;       // Download progress (0-100)
  downloading: boolean;   // Whether currently downloading
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import { useModelDownload } from '../hooks/useModelDownload';

const ModelSelectionScreen: React.FC = () => {
  const {
    availableModels,
    downloadStatus,
    selectedModelId,
    setSelectedModelId,
    handleDownloadModel,
    canContinue,
  } = useModelDownload();

  return (
    <View>
      <ModelSelection
        models={availableModels}
        downloadStatus={downloadStatus}
        selectedModelId={selectedModelId}
        onDownloadModel={handleDownloadModel}
        onModelSelected={setSelectedModelId}
      />
      
      <TouchableOpacity
        disabled={!canContinue}
        onPress={() => navigation.navigate('Chat', { modelId: selectedModelId })}
      >
        <Text>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### With Navigation Integration

```typescript
const ModelSelectionScreen: React.FC = ({ navigation }) => {
  const {
    availableModels,
    downloadStatus,
    selectedModelId,
    setSelectedModelId,
    handleDownloadModel,
    atLeastOneDownloaded,
    canContinue,
  } = useModelDownload();

  const handleContinue = () => {
    if (canContinue && selectedModelId) {
      navigation.navigate('Chat', { modelId: selectedModelId });
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <ModelSelection
          models={availableModels.filter(m => !!m.model_id)}
          downloadStatus={downloadStatus}
          selectedModelId={selectedModelId}
          onDownloadModel={handleDownloadModel}
          onCancelDownload={() => {}} // Not implemented yet
          onDeleteModel={() => {}}    // Not implemented yet
          onModelSelected={setSelectedModelId}
        />
      </ScrollView>
      
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: canContinue ? theme.accent : theme.border }
        ]}
        disabled={!canContinue}
        onPress={handleContinue}
      >
        <Text>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
```

## 🔧 Internal Implementation

### Model Discovery

```typescript
export const useModelDownload = () => {
  const [availableModels, setAvailableModels] = useState<AiModelSettings[]>([]);
  const [downloadStatus, setDownloadStatus] = useState<Record<string, DownloadStatus>>({});
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Load available models and check download status
  useEffect(() => {
    getModels().then(async models => {
      setAvailableModels(models);
      
      // Check for local model existence using react-native-ai logic
      const status: Record<string, DownloadStatus> = {};
      await Promise.all(models.map(async (model) => {
        if (model.model_id) {
          const modelConfigFile = `${RNFS.DocumentDirectoryPath}/${MODEL_CONFIG_PATH(model.model_id)}`;
          const exists = await RNFS.exists(modelConfigFile);
          status[model.model_id] = {
            downloaded: exists,
            progress: exists ? 100 : 0,
            downloading: false,
          };
        }
      }));
      setDownloadStatus(status);
      
      // Auto-select the first downloaded model if none selected
      if (!selectedModelId) {
        const firstDownloaded = models.find(m => m.model_id && status[m.model_id]?.downloaded);
        if (firstDownloaded && firstDownloaded.model_id) {
          setSelectedModelId(firstDownloaded.model_id);
        }
      }
    });
  }, [selectedModelId]);
};
```

### Download Implementation

```typescript
const handleDownloadModel = useCallback((model: AiModelSettings) => {
  if (!model.model_id) return;
  
  const modelId = model.model_id;
  setDownloadStatus(prev => ({
    ...prev,
    [modelId]: { downloaded: false, progress: 0, downloading: true },
  }));

  downloadModel(modelId, {
    onStart: () => {
      console.log(`Started downloading ${modelId}`);
    },
    onProgress: (progress) => {
      setDownloadStatus(prev => ({
        ...prev,
        [modelId]: { 
          ...prev[modelId], 
          progress: progress.percentage, 
          downloading: true 
        },
      }));
    },
    onComplete: async () => {
      setDownloadStatus(prev => ({
        ...prev,
        [modelId]: { downloaded: true, progress: 100, downloading: false },
      }));
      setSelectedModelId(modelId);
      
      // Create a record file for tracking
      const recordDir = `${RNFS.DocumentDirectoryPath}/${DOWNLOADED_MODELS_DIR}`;
      const recordFile = `${recordDir}/${modelId}`;
      try {
        const dirExists = await RNFS.exists(recordDir);
        if (!dirExists) {
          await RNFS.mkdir(recordDir);
        }
        await RNFS.writeFile(recordFile, 'downloaded', 'utf8');
      } catch (e) {
        console.warn('Failed to record downloaded model:', e);
      }
    },
    onError: (error) => {
      console.error(`Download failed for ${modelId}:`, error);
      setDownloadStatus(prev => ({
        ...prev,
        [modelId]: { downloaded: false, progress: 0, downloading: false },
      }));
    },
  });
}, []);
```

### Status Verification

```typescript
// Check if model files exist
const checkModelExists = async (modelId: string): Promise<boolean> => {
  const modelConfigFile = `${RNFS.DocumentDirectoryPath}/${MODEL_CONFIG_PATH(modelId)}`;
  return await RNFS.exists(modelConfigFile);
};

// Model config path helper
const MODEL_CONFIG_PATH = (modelId: string) => 
  `bundle/${modelId}/mlc-chat-config.json`;
```

## 📊 State Management

### Download Status States

```typescript
// Not downloaded
{
  downloaded: false,
  progress: 0,
  downloading: false,
}

// Downloading (with progress)
{
  downloaded: false,
  progress: 45,        // 0-100
  downloading: true,
}

// Downloaded and ready
{
  downloaded: true,
  progress: 100,
  downloading: false,
}

// Download failed
{
  downloaded: false,
  progress: 0,
  downloading: false,
}
```

### Auto-Selection Logic

```typescript
// Auto-select first downloaded model
if (!selectedModelId) {
  const firstDownloaded = models.find(m => 
    m.model_id && status[m.model_id]?.downloaded
  );
  if (firstDownloaded && firstDownloaded.model_id) {
    setSelectedModelId(firstDownloaded.model_id);
  }
}
```

### Computed Properties

```typescript
const atLeastOneDownloaded = Object.values(downloadStatus).some(status => status.downloaded);
const canContinue = atLeastOneDownloaded && selectedModelId && downloadStatus[selectedModelId]?.downloaded;
```

## 🗃️ Storage Management

### File System Structure

```
Documents/
├── bundle/                    # Model files (managed by react-native-ai)
│   ├── llama-2-7b/
│   │   ├── mlc-chat-config.json
│   │   └── model_weights/
│   └── mistral-7b/
│       ├── mlc-chat-config.json
│       └── model_files/
└── downloaded_models/         # Download tracking records
    ├── llama-2-7b            # Simple text file marking download
    └── mistral-7b
```

### Download Tracking

```typescript
// Create download record
const recordDir = `${RNFS.DocumentDirectoryPath}/${DOWNLOADED_MODELS_DIR}`;
const recordFile = `${recordDir}/${modelId}`;

await RNFS.mkdir(recordDir);
await RNFS.writeFile(recordFile, 'downloaded', 'utf8');
```

## 🧪 Testing

### Unit Tests

```typescript
describe('useModelDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock react-native-ai
    jest.mock('react-native-ai', () => ({
      getModels: jest.fn(),
      downloadModel: jest.fn(),
    }));
  });

  it('should load available models on mount', async () => {
    const mockModels = [
      { model_id: 'test-model-1' },
      { model_id: 'test-model-2' },
    ];

    getModels.mockResolvedValue(mockModels);
    RNFS.exists.mockResolvedValue(false);

    const { result, waitFor } = renderHook(() => useModelDownload());

    await waitFor(() => {
      expect(result.current.availableModels).toEqual(mockModels);
    });
  });

  it('should detect downloaded models', async () => {
    const mockModels = [{ model_id: 'test-model' }];
    
    getModels.mockResolvedValue(mockModels);
    RNFS.exists.mockResolvedValue(true); // Model exists

    const { result, waitFor } = renderHook(() => useModelDownload());

    await waitFor(() => {
      expect(result.current.downloadStatus['test-model']).toEqual({
        downloaded: true,
        progress: 100,
        downloading: false,
      });
    });
  });

  it('should handle model download', async () => {
    const mockModel = { model_id: 'test-model' };
    const mockDownloadCallbacks = {};

    downloadModel.mockImplementation((modelId, callbacks) => {
      Object.assign(mockDownloadCallbacks, callbacks);
      // Simulate immediate start
      callbacks.onStart();
    });

    const { result } = renderHook(() => useModelDownload());

    act(() => {
      result.current.handleDownloadModel(mockModel);
    });

    expect(downloadModel).toHaveBeenCalledWith('test-model', expect.any(Object));
    
    // Test progress update
    act(() => {
      mockDownloadCallbacks.onProgress({ percentage: 50 });
    });

    expect(result.current.downloadStatus['test-model']).toEqual({
      downloaded: false,
      progress: 50,
      downloading: true,
    });

    // Test completion
    await act(async () => {
      await mockDownloadCallbacks.onComplete();
    });

    expect(result.current.downloadStatus['test-model']).toEqual({
      downloaded: true,
      progress: 100,
      downloading: false,
    });
    expect(result.current.selectedModelId).toBe('test-model');
  });

  it('should handle download errors', async () => {
    const mockModel = { model_id: 'test-model' };
    const mockError = new Error('Download failed');

    downloadModel.mockImplementation((modelId, callbacks) => {
      callbacks.onError(mockError);
    });

    const { result } = renderHook(() => useModelDownload());

    act(() => {
      result.current.handleDownloadModel(mockModel);
    });

    expect(result.current.downloadStatus['test-model']).toEqual({
      downloaded: false,
      progress: 0,
      downloading: false,
    });
  });

  it('should auto-select first downloaded model', async () => {
    const mockModels = [
      { model_id: 'model-1' },
      { model_id: 'model-2' },
    ];

    getModels.mockResolvedValue(mockModels);
    RNFS.exists
      .mockResolvedValueOnce(false) // model-1 not downloaded
      .mockResolvedValueOnce(true); // model-2 downloaded

    const { result, waitFor } = renderHook(() => useModelDownload());

    await waitFor(() => {
      expect(result.current.selectedModelId).toBe('model-2');
    });
  });

  it('should calculate canContinue correctly', async () => {
    const mockModels = [{ model_id: 'test-model' }];
    
    getModels.mockResolvedValue(mockModels);
    RNFS.exists.mockResolvedValue(true);

    const { result, waitFor } = renderHook(() => useModelDownload());

    await waitFor(() => {
      expect(result.current.canContinue).toBe(true);
      expect(result.current.atLeastOneDownloaded).toBe(true);
    });
  });
});
```

### Integration Tests

```typescript
describe('useModelDownload Integration', () => {
  it('should integrate with ModelSelection component', async () => {
    const TestComponent = () => {
      const modelDownload = useModelDownload();
      return <ModelSelection {...modelDownload} />;
    };

    const { getByText } = render(<TestComponent />);
    // Test component integration
  });

  it('should work with file system operations', async () => {
    // Create mock model files
    const modelDir = `${RNFS.DocumentDirectoryPath}/bundle/test-model`;
    const configFile = `${modelDir}/mlc-chat-config.json`;
    
    await RNFS.mkdir(modelDir);
    await RNFS.writeFile(configFile, '{}', 'utf8');

    const { result, waitFor } = renderHook(() => useModelDownload());

    await waitFor(() => {
      expect(result.current.downloadStatus['test-model']?.downloaded).toBe(true);
    });

    // Cleanup
    await RNFS.unlink(configFile);
    await RNFS.unlink(modelDir);
  });
});
```

## ⚡ Performance Considerations

### Efficient File Checking

```typescript
// Parallel file existence checks
await Promise.all(models.map(async (model) => {
  if (model.model_id) {
    const exists = await RNFS.exists(modelConfigFile);
    // Process results
  }
}));
```

### State Updates

```typescript
// Batch state updates
setDownloadStatus(prev => ({
  ...prev,
  [modelId]: { downloaded: true, progress: 100, downloading: false },
}));
```

### Memory Management

- **Model List Caching**: Models are loaded once and cached
- **Status Tracking**: Only essential status information stored
- **File System**: Efficient file existence checking

## 🔮 Future Enhancements

Potential improvements to useModelDownload:

- **Download Cancellation**: Ability to cancel in-progress downloads
- **Model Deletion**: Remove downloaded models to free space
- **Batch Downloads**: Download multiple models simultaneously
- **Download Queue**: Queue system for managing multiple downloads
- **Storage Analytics**: Show storage usage per model
- **Model Updates**: Check for and download model updates
- **Download Prioritization**: Prioritize downloads based on user preference
- **Offline Detection**: Handle offline scenarios gracefully

## 🚨 Common Issues

### Download Failures
- **Network Issues**: Check internet connectivity
- **Storage Space**: Ensure sufficient device storage
- **Permissions**: Verify file system write permissions

### Model Detection Issues
- **File Path Changes**: Model paths may change between app versions
- **Incomplete Downloads**: Handle partially downloaded models
- **File Corruption**: Verify model file integrity

### Performance Issues
- **Large Models**: Download progress may appear slow for large models
- **Multiple Downloads**: Avoid downloading multiple models simultaneously
- **Memory Usage**: Monitor memory usage during downloads

---

*useModelDownload provides comprehensive model management for seamless AI model integration!* 🤖📦