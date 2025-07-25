# ModelSelection

The `ModelSelection` component provides a comprehensive interface for browsing, downloading, and selecting AI models in ReactNativeLLM.

## 📋 Overview

**Location**: `src/components/ModelSelection.tsx`
**Purpose**: Display available models with download and selection functionality

This component renders a list of available AI models, showing their download status, progress, and allowing users to download and select models for use.

## 🎯 Props Interface

```typescript
interface ModelSelectionProps {
  models: AiModelSettings[];                                    // Available AI models
  downloadStatus: Record<string, DownloadStatus>;              // Download state per model
  selectedModelId: string | null;                              // Currently selected model
  onDownloadModel: (model: AiModelSettings) => void;          // Download initiation handler
  onCancelDownload: (model: AiModelSettings) => void;         // Download cancellation handler
  onDeleteModel: (model: AiModelSettings) => void;            // Model deletion handler
  onModelSelected: (modelId: string) => void;                 // Model selection handler
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
import { ModelSelection } from '../components/ModelSelection';
import { useModelDownload } from '../hooks/useModelDownload';

const ModelSelectionScreen: React.FC = () => {
  const {
    availableModels,
    downloadStatus,
    selectedModelId,
    setSelectedModelId,
    handleDownloadModel,
  } = useModelDownload();

  return (
    <ModelSelection
      models={availableModels}
      downloadStatus={downloadStatus}
      selectedModelId={selectedModelId}
      onDownloadModel={handleDownloadModel}
      onCancelDownload={() => {}}
      onDeleteModel={() => {}}
      onModelSelected={setSelectedModelId}
    />
  );
};
```

### With Full Functionality

```typescript
const ModelSelectionScreen: React.FC = () => {
  const {
    availableModels,
    downloadStatus,
    selectedModelId,
    setSelectedModelId,
    handleDownloadModel,
    handleCancelDownload,
    handleDeleteModel,
  } = useModelDownload();

  return (
    <ScrollView style={styles.container}>
      <ModelSelection
        models={availableModels.filter(m => !!m.model_id)}
        downloadStatus={downloadStatus}
        selectedModelId={selectedModelId}
        onDownloadModel={handleDownloadModel}
        onCancelDownload={handleCancelDownload}
        onDeleteModel={handleDeleteModel}
        onModelSelected={setSelectedModelId}
      />
    </ScrollView>
  );
};
```

## 🎨 Visual Design

### Model Card States

#### Not Downloaded
- **Background**: Secondary background color
- **Icon**: Download icon (blue)
- **Interaction**: Tap to start download
- **Opacity**: 50% (disabled appearance)

#### Downloading
- **Background**: Secondary background color
- **Icon**: Progress circle with percentage
- **Interaction**: Tap to cancel (if implemented)
- **Opacity**: 50% (disabled appearance)

#### Downloaded
- **Background**: Secondary background color
- **Icon**: Green checkmark
- **Interaction**: Tap to select
- **Opacity**: 100% (enabled appearance)

#### Selected
- **Background**: Enhanced background with shadow
- **Icon**: Green checkmark
- **Styling**: Elevated appearance with shadow
- **Opacity**: 100%

### Dynamic Styling

```typescript
// Selection-based styling
const cardStyle = isSelected ? [
  {
    backgroundColor: isColorDark(theme.background) 
      ? '#23243f' 
      : '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  }
] : [
  { backgroundColor: theme.secondaryBackground }
];

// Download status opacity
const cardOpacity = status.downloaded ? 1 : 0.5;
```

## 🔧 Model Status Management

### Download States

```typescript
// Not downloaded
{
  downloaded: false,
  progress: 0,
  downloading: false,
}

// Downloading
{
  downloaded: false,
  progress: 45,        // 0-100
  downloading: true,
}

// Downloaded
{
  downloaded: true,
  progress: 100,
  downloading: false,
}
```

### Status Icons

```typescript
// Downloaded state
<CheckCircleIcon
  size={20}
  color={theme.accent}
  weight="fill"
/>

// Downloading state
<Circle
  size={22}
  progress={status.progress / 100}
  showsText={true}
  color={theme.progressBar}
  unfilledColor={theme.progressBackground}
  formatText={() => `${Math.round(status.progress)}%`}
/>

// Not downloaded state
<TouchableOpacity onPress={() => onDownloadModel(model)}>
  <DownloadIcon
    size={20}
    color={theme.downloadIcon}
    weight="bold"
  />
</TouchableOpacity>
```

## 🎯 Interaction Behavior

### Model Selection

```typescript
<TouchableOpacity
  onPress={() => {
    if (status.downloaded) onModelSelected(modelId);
  }}
  disabled={!status.downloaded}
  style={cardStyle}
>
```

**Rules**:
- Only downloaded models can be selected
- Selection triggers navigation or model preparation
- Visual feedback through styling changes

### Download Initiation

```typescript
const handleDownload = () => {
  if (!status.downloaded && !status.downloading) {
    onDownloadModel(model);
  }
};
```

**Process**:
1. User taps download icon
2. Download begins with progress tracking
3. Progress circle shows real-time status
4. Completion triggers selection availability

## 🎨 Styling System

### Theme Integration

```typescript
const { theme } = useTheme();

// Card styling
const styles = StyleSheet.create({
  modelRow: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
    padding: 10,
    // Dynamic background applied via props
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  modelName: {
    fontSize: 13,
    fontWeight: '500',
    // Dynamic color applied via props
  },
});
```

### Color Utility Function

```typescript
function isColorDark(hex: string) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance < 0.5;
}
```

**Purpose**: Determine appropriate contrast colors for selection styling

## ⚡ Performance Considerations

### Efficient Rendering

```typescript
// Filter models with valid IDs
{models.filter(m => !!m.model_id).map((model) => {
  // Render logic
})}
```

### Optimized Updates

- **Status Caching**: Download status is memoized
- **Conditional Rendering**: Only render necessary icons
- **List Optimization**: Efficient key-based rendering

### Memory Management

- **Icon Caching**: Icons are cached by the icon library
- **Progress Cleanup**: Progress indicators cleanup properly
- **State Management**: Efficient state updates

## 🧪 Testing

### Unit Tests

```typescript
describe('ModelSelection', () => {
  const mockModels = [
    { model_id: 'test-model-1' },
    { model_id: 'test-model-2' },
  ];

  const mockDownloadStatus = {
    'test-model-1': { downloaded: true, progress: 100, downloading: false },
    'test-model-2': { downloaded: false, progress: 0, downloading: false },
  };

  it('should render model list correctly', () => {
    const { getByText } = render(
      <ModelSelection
        models={mockModels}
        downloadStatus={mockDownloadStatus}
        selectedModelId={null}
        onDownloadModel={() => {}}
        onCancelDownload={() => {}}
        onDeleteModel={() => {}}
        onModelSelected={() => {}}
      />
    );
    
    expect(getByText('test-model-1')).toBeTruthy();
    expect(getByText('test-model-2')).toBeTruthy();
  });

  it('should handle model selection', () => {
    const onModelSelected = jest.fn();
    const { getByText } = render(
      <ModelSelection
        models={mockModels}
        downloadStatus={mockDownloadStatus}
        selectedModelId={null}
        onModelSelected={onModelSelected}
        // ... other props
      />
    );
    
    fireEvent.press(getByText('test-model-1'));
    expect(onModelSelected).toHaveBeenCalledWith('test-model-1');
  });

  it('should initiate download for undownloaded models', () => {
    const onDownloadModel = jest.fn();
    const { getByTestId } = render(
      <ModelSelection
        models={mockModels}
        downloadStatus={mockDownloadStatus}
        onDownloadModel={onDownloadModel}
        // ... other props
      />
    );
    
    fireEvent.press(getByTestId('download-button-test-model-2'));
    expect(onDownloadModel).toHaveBeenCalledWith(mockModels[1]);
  });
});
```

### Integration Tests

```typescript
describe('ModelSelection Integration', () => {
  it('should integrate with useModelDownload hook', () => {
    const TestComponent = () => {
      const downloadHook = useModelDownload();
      return <ModelSelection {...downloadHook} />;
    };
    
    const { getByText } = render(<TestComponent />);
    // Test integration behavior
  });
});
```

## 📱 Platform Considerations

### iOS Adaptations
- **Shadow Styling**: iOS-specific shadow properties
- **Touch Feedback**: Subtle opacity changes
- **Typography**: San Francisco font integration
- **Safe Areas**: Proper spacing for notched devices

### Android Adaptations
- **Elevation**: Material Design elevation
- **Ripple Effects**: Touch feedback
- **Typography**: Roboto font integration
- **Navigation**: Hardware back button support

## 🔮 Future Enhancements

Potential improvements to ModelSelection:

- **Model Categories**: Group models by type or capability
- **Search/Filter**: Search models by name or features
- **Model Info**: Detailed model information modal
- **Batch Operations**: Download multiple models
- **Storage Management**: Show storage usage per model
- **Update Notifications**: Notify when model updates available
- **Favorites**: Mark frequently used models
- **Performance Metrics**: Show model performance stats

## 🚨 Common Issues

### Download Issues
- **Network Problems**: Show error states for failed downloads
- **Storage Space**: Check available space before download
- **Permissions**: Ensure proper file system permissions

### Selection Issues
- **State Sync**: Ensure selection state syncs with navigation
- **Visual Feedback**: Clear indication of selected model
- **Disabled States**: Proper handling of unavailable models

### Performance Issues
- **Large Model Lists**: Consider virtualization for many models
- **Progress Updates**: Throttle progress updates for smooth performance
- **Memory Usage**: Monitor memory usage with large model files

---

*ModelSelection provides an intuitive interface for managing AI models in your app!* 🤖📦