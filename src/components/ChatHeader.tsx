import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeftIcon, ArrowClockwise } from 'phosphor-react-native';
import { useTheme } from '../theme/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';
import ContextToggleButton from './ContextToggleButton';

interface ChatHeaderProps {
  modelId: string;
  contextEnabled: boolean;
  contextAvailable: boolean;
  onContextToggle: (enabled: boolean) => void;
  onCreateTestContext: () => void;
  onRefreshContext: () => void;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  modelId,
  contextEnabled,
  contextAvailable,
  onContextToggle,
  onCreateTestContext,
  onRefreshContext,
  onBack,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.topRow}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeftIcon size={22} color={theme.text} weight="bold" />
      </TouchableOpacity>
      <Text 
        style={[styles.title, { color: theme.text }]} 
        numberOfLines={1} 
        ellipsizeMode="tail"
      >
        {modelId}
      </Text>
      <ContextToggleButton 
        enabled={contextEnabled} 
        onToggle={onContextToggle}
        available={contextAvailable}
        onLongPress={onCreateTestContext}
        style={styles.contextButton}
      />
      {contextAvailable && (
        <TouchableOpacity
          onPress={onRefreshContext}
          style={styles.refreshButton}
          accessibilityLabel="Refresh context"
          accessibilityHint="Manually refresh context from file"
        >
          <ArrowClockwise size={20} color={theme.placeholder} weight="bold" />
        </TouchableOpacity>
      )}
      <ThemeToggleButton style={styles.themeButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: 'transparent',
    gap: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  contextButton: {
    marginRight: 4,
  },
  refreshButton: {
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    minHeight: 32,
    marginRight: 4,
  },
  themeButton: {
    marginLeft: 8,
  },
});

export default ChatHeader; 