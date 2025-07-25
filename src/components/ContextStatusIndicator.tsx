import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Database, ArrowClockwise } from 'phosphor-react-native';
import { useTheme } from '../theme/ThemeContext';

interface ContextStatusIndicatorProps {
  contextAvailable: boolean;
  onRefresh: () => void;
}

const ContextStatusIndicator: React.FC<ContextStatusIndicatorProps> = ({
  contextAvailable,
  onRefresh,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Database 
        size={16} 
        color={contextAvailable ? theme.accent : theme.placeholder} 
        weight={contextAvailable ? 'fill' : 'regular'} 
      />
      <Text style={[styles.text, { 
        color: contextAvailable ? theme.text : theme.placeholder 
      }]}>
        {contextAvailable ? 'Context file detected' : 'No context file found'}
      </Text>
      <TouchableOpacity
        onPress={onRefresh}
        style={styles.refreshButton}
        accessibilityLabel="Refresh context"
        accessibilityHint="Manually refresh context from file"
      >
        <ArrowClockwise size={14} color={theme.placeholder} weight="bold" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
    flex: 1,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
});

export default ContextStatusIndicator; 