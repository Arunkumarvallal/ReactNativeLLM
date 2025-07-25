// src/screens/ChatScreenStore.ts
// Singleton in-memory store for chat messages and model preparation status
import { IMessage } from 'react-native-gifted-chat';

interface ChatScreenState {
  messages: IMessage[];
  preparing: boolean;
  prepared: boolean;
  contextEnabled?: boolean; // New field for context toggle state
}

// Store keyed by modelId
const chatScreenStore: Record<string, ChatScreenState> = {};

export function getChatScreenState(modelId: string): ChatScreenState | undefined {
  return chatScreenStore[modelId];
}

export function setChatScreenState(modelId: string, state: ChatScreenState) {
  chatScreenStore[modelId] = state;
}

export function clearChatScreenState(modelId: string) {
  delete chatScreenStore[modelId];
}
