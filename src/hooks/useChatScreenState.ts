import { useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { getChatScreenState, setChatScreenState } from '../screens/ChatScreenStore';

interface UseChatScreenStateProps {
  modelId?: string;
  messages: IMessage[];
  preparing: boolean;
  prepared: boolean;
  contextEnabled: boolean;
}

export const useChatScreenState = ({
  modelId,
  messages,
  preparing,
  prepared,
  contextEnabled,
}: UseChatScreenStateProps) => {
  // Get initial state from store
  const getInitialState = () => {
    if (!modelId) return undefined;
    return getChatScreenState(modelId);
  };

  // Persist state to store on every change
  useEffect(() => {
    if (modelId) {
      setChatScreenState(modelId, {
        messages,
        preparing,
        prepared,
        contextEnabled,
      });
    }
  }, [modelId, messages, preparing, prepared, contextEnabled]);

  return {
    getInitialState,
  };
}; 