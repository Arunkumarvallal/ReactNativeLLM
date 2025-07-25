import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useTheme } from '../theme/ThemeContext';
import { getChatScreenState } from './ChatScreenStore';
import { useChatMessages } from '../hooks/useChatMessages';
import { useModelPreparation } from '../hooks/useModelPreparation';
import { useContextManager } from '../hooks/useContextManager';
import { useChatScreenState } from '../hooks/useChatScreenState';
import ChatHeader from '../components/ChatHeader';
import CustomGiftedChat from '../components/CustomGiftedChat';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { modelId } = route.params;
  
  // Get initial state from store
  const initialState = modelId ? getChatScreenState(modelId) : undefined;
  
  // Context management - initialize with stored state if available
  const {
    contextAvailable,
    contextEnabled,
    setContextEnabled,
    handleCreateTestContext,
    handleRefreshContext,
    getContextForQuery,
  } = useContextManager({
    initialContextEnabled: initialState?.contextEnabled,
  });

  // Chat messages handling
  const { displayedMessages, text, setText, onSend, updateMessages } = useChatMessages({
    modelId,
    initialMessages: initialState?.messages || [],
    getContextForQuery,
    contextEnabled,
    contextAvailable,
  });

  // Model preparation
  const { preparing, prepared } = useModelPreparation({
    modelId,
    initialPreparing: initialState?.preparing ?? true,
    initialPrepared: initialState?.prepared ?? false,
    onMessagesUpdate: updateMessages,
  });

  // State persistence
  useChatScreenState({
    modelId,
    messages: displayedMessages,
    preparing,
    prepared,
    contextEnabled,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ChatHeader
        modelId={modelId}
        contextEnabled={contextEnabled}
        contextAvailable={contextAvailable}
        onContextToggle={setContextEnabled}
        onCreateTestContext={handleCreateTestContext}
        onRefreshContext={handleRefreshContext}
        onBack={() => navigation.goBack()}
      />
      <CustomGiftedChat
        messages={displayedMessages}
        onSend={onSend}
        text={text}
        onInputTextChanged={setText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen; 