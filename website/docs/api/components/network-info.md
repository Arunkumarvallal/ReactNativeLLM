# NetworkInfo

The `NetworkInfo` component displays the current network connectivity status, providing users with visual feedback about their internet connection.

## 📋 Overview

**Location**: `src/components/NetworkInfo.tsx`
**Purpose**: Show network connectivity status with appropriate icons

This component appears in the Model Selection Screen to inform users about their network status, which is important for model downloads.

## 🎯 Props Interface

```typescript
interface NetworkInfoProps {
  theme: ThemeType;    // Theme object for styling
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import NetworkInfo from '../components/NetworkInfo';
import { useTheme } from '../theme/ThemeContext';

const ModelSelectionScreen: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.header}>
      <Text style={styles.title}>RN LLM Chat</Text>
      <View style={styles.controls}>
        <NetworkInfo theme={theme} />
        <ThemeToggleButton />
      </View>
    </View>
  );
};
```

### In Header Layout

```typescript
const ModelSelectionScreen: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView>
      <View style={styles.titleRow}>
        <Text style={styles.title}>RN LLM Chat</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <NetworkInfo theme={theme} />
          <ThemeToggleButton />
        </View>
      </View>
    </SafeAreaView>
  );
};
```

## 🌐 Network Status Detection

### Connection Detection

```typescript
import { useNetInfo } from '@react-native-community/netinfo';

const NetworkInfo: React.FC<NetworkInfoProps> = ({ theme }) => {
  const netInfo = useNetInfo();
  const isWifiConnected = netInfo.type === 'wifi' && netInfo.isConnected;

  // Component logic
};
```

### Network States

#### Wi-Fi Connected
- **Condition**: `netInfo.type === 'wifi' && netInfo.isConnected`
- **Icon**: `WifiHigh` (filled)
- **Color**: Theme text color
- **Meaning**: Strong Wi-Fi connection available

#### No Connection / Other
- **Condition**: Not Wi-Fi or not connected
- **Icon**: `LinkBreak` (filled)
- **Color**: Theme text color
- **Meaning**: No Wi-Fi or connection issues

## 🎨 Visual Design

### Icon Display

```typescript
return (
  <View style={styles.container}>
    {isWifiConnected ? (
      <WifiHigh size={22} color={theme.text} weight="fill" />
    ) : (
      <LinkBreak size={22} color={theme.text} weight="fill" />
    )}
  </View>
);
```

### Container Styling

```typescript
const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
});
```

**Features**:
- **Centered Layout**: Icon centered in container
- **Consistent Sizing**: 22px icon size
- **Adequate Spacing**: 8px padding
- **Minimum Width**: Ensures consistent layout

## 🔍 Network Types Handled

### Supported Connection Types

```typescript
// Wi-Fi connection (preferred for downloads)
netInfo.type === 'wifi' && netInfo.isConnected

// Other connection types (cellular, etc.)
// Currently treated as "not Wi-Fi"
```

### Connection Quality Indicators

The component currently shows a binary state:
- **Connected**: Wi-Fi available
- **Not Connected**: No Wi-Fi or connection issues

## 🎯 Use Cases

### Model Download Context
- **Purpose**: Inform users about connection quality before downloads
- **Importance**: Large model files benefit from stable Wi-Fi
- **User Guidance**: Visual cue for optimal download conditions

### App Status
- **Network Awareness**: Users understand app connectivity
- **Troubleshooting**: Helps diagnose connection-related issues
- **User Experience**: Transparent network status

## ♿ Accessibility

### Screen Reader Support

```typescript
<View 
  style={styles.container}
  accessibilityLabel={isWifiConnected ? "Wi-Fi connected" : "No Wi-Fi connection"}
  accessibilityRole="status"
>
```

### Accessibility Features
- **Status Information**: Clear connection status for screen readers
- **Role Definition**: Marked as status information
- **Visual Indicators**: High contrast icons

## 🧪 Testing

### Unit Tests

```typescript
describe('NetworkInfo', () => {
  const mockTheme = {
    text: '#000000',
    // ... other theme properties
  };

  it('should show Wi-Fi icon when connected', () => {
    // Mock netInfo to return Wi-Fi connected
    jest.mock('@react-native-community/netinfo', () => ({
      useNetInfo: () => ({
        type: 'wifi',
        isConnected: true,
      }),
    }));

    const { getByTestId } = render(
      <NetworkInfo theme={mockTheme} />
    );
    
    expect(getByTestId('wifi-icon')).toBeTruthy();
  });

  it('should show disconnected icon when not on Wi-Fi', () => {
    // Mock netInfo to return no Wi-Fi
    jest.mock('@react-native-community/netinfo', () => ({
      useNetInfo: () => ({
        type: 'cellular',
        isConnected: true,
      }),
    }));

    const { getByTestId } = render(
      <NetworkInfo theme={mockTheme} />
    );
    
    expect(getByTestId('disconnected-icon')).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
describe('NetworkInfo Integration', () => {
  it('should update when network status changes', async () => {
    const { rerender } = render(<NetworkInfo theme={mockTheme} />);
    
    // Simulate network change
    // Test that component updates appropriately
  });
});
```

## 📱 Platform Considerations

### iOS Implementation
- **Network Framework**: Uses iOS network monitoring
- **Status Bar**: Coordinates with system status indicators
- **Privacy**: Respects iOS privacy settings

### Android Implementation
- **Network Manager**: Uses Android connectivity services
- **Permissions**: Requires network state permissions
- **Background**: Handles background network changes

### Network Permissions

#### Android Manifest
```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

#### iOS Info.plist
```xml
<!-- Network usage is automatically allowed -->
```

## 🔧 Advanced Features

### Extended Network Information

```typescript
// Future enhancement: More detailed network info
interface ExtendedNetworkInfo {
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  signalStrength: 'weak' | 'moderate' | 'strong';
  downloadSpeed: number; // Mbps
  isMetered: boolean;     // Cellular data
}

const ExtendedNetworkInfo: React.FC = () => {
  const netInfo = useNetInfo();
  
  const getSignalStrengthIcon = () => {
    // Return appropriate icon based on signal strength
  };
  
  const getConnectionTypeIcon = () => {
    // Return appropriate icon based on connection type
  };
  
  return (
    <View style={styles.container}>
      {getConnectionTypeIcon()}
      {getSignalStrengthIcon()}
    </View>
  );
};
```

### Network Quality Testing

```typescript
// Future enhancement: Network speed testing
const useNetworkQuality = () => {
  const [speed, setSpeed] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);
  
  const testSpeed = async () => {
    setTesting(true);
    // Implement speed test logic
    setTesting(false);
  };
  
  return { speed, testing, testSpeed };
};
```

## 🔮 Future Enhancements

Potential improvements to NetworkInfo:

- **Signal Strength**: Show Wi-Fi signal strength
- **Connection Speed**: Display estimated connection speed
- **Data Usage**: Show whether connection is metered
- **Connection Type**: Distinguish between different connection types
- **Network Quality**: Test and display network quality
- **Offline Mode**: Show offline status
- **Background Updates**: Real-time network monitoring
- **User Controls**: Allow users to override connection preferences

## 🚨 Common Issues

### Network Detection Issues
- **Permission Denied**: Ensure proper network permissions
- **Delayed Updates**: Network state changes may have delays
- **False Positives**: Connected doesn't always mean internet access

### Performance Considerations
- **Battery Usage**: Network monitoring can impact battery
- **Update Frequency**: Balance between accuracy and performance
- **Memory Leaks**: Ensure proper cleanup of network listeners

### Platform Differences
- **iOS vs Android**: Different network detection behaviors
- **Simulator Issues**: Network detection may differ in simulators
- **Testing**: Mock network states for consistent testing

---

*NetworkInfo keeps users informed about their connection status for optimal app experience!* 📶🌐