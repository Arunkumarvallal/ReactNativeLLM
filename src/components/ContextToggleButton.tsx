import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Database, X } from 'phosphor-react-native';
import { useTheme } from '../theme/ThemeContext';

interface ContextToggleButtonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  available: boolean; // Whether context.md file exists
  style?: ViewStyle;
  onLongPress?: () => void; // Optional long press handler for debug actions
}

const ContextToggleButton: React.FC<ContextToggleButtonProps> = ({
  enabled,
  onToggle,
  available,
  style,
  onLongPress
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity
      onPress={() => available ? onToggle(!enabled) : onLongPress?.()}
      onLongPress={onLongPress}
      style={[styles.button, style, { opacity: available ? 1 : 0.5 }]}
      accessibilityLabel={available ? `${enabled ? 'Disable' : 'Enable'} context` : 'Create test context'}
      accessibilityHint={available ? `Context is currently ${enabled ? 'enabled' : 'disabled'}` : 'Long press to create test context file'}
    >
      {enabled ? (
        <Database size={22} color={theme.accent} weight="fill" />
      ) : (
        <Database size={22} color={theme.placeholder} weight="regular" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 34,
    minHeight: 34,
  },
});

export default ContextToggleButton; 