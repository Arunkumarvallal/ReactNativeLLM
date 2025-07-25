import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ModelSelection } from '../components/ModelSelection';
import { useTheme } from '../theme/ThemeContext';
import ThemeToggleButton from '../components/ThemeToggleButton';
import NetworkInfo from '../components/NetworkInfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useModelDownload } from '../hooks/useModelDownload';
import { useContextManager } from '../hooks/useContextManager';
import ContextStatusIndicator from '../components/ContextStatusIndicator';

type ModelSelectionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ModelSelection'>;

interface Props {
  navigation: ModelSelectionScreenNavigationProp;
}

const ModelSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Model download management
  const {
    availableModels,
    downloadStatus,
    selectedModelId,
    setSelectedModelId,
    handleDownloadModel,
    atLeastOneDownloaded,
    canContinue,
  } = useModelDownload();

  // Context management
  const {
    contextAvailable,
    handleRefreshContext,
  } = useContextManager();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }] }>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>RN LLM Chat</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <NetworkInfo theme={theme} />
          <ThemeToggleButton />
        </View>
      </View>
      <Text style={[styles.subtitle, { color: theme.placeholder }]}>MODELS</Text>
      
      <ContextStatusIndicator 
        contextAvailable={contextAvailable} 
        onRefresh={handleRefreshContext} 
      />
      
      <ScrollView style={styles.modelBox}>
        <ModelSelection
          models={availableModels.filter(m => !!m.model_id)}
          downloadStatus={downloadStatus}
          selectedModelId={selectedModelId}
          onDownloadModel={handleDownloadModel}
          onCancelDownload={() => {}}
          onDeleteModel={() => {}}
          onModelSelected={setSelectedModelId}
        />
      </ScrollView>
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: canContinue ? theme.accent : theme.border }]}
        disabled={!canContinue}
        onPress={() => {
          if (canContinue && selectedModelId) {
            navigation.navigate('Chat', { modelId: selectedModelId });
          }
        }}
      >
        <Text style={[styles.continueButtonText, { color: canContinue ? '#fff' : theme.placeholder }]}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  modelBox: {
    flex: 1,
    marginBottom: 16,
  },
  continueButton: {
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ModelSelectionScreen; 