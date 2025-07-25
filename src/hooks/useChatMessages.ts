import { useState, useCallback } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { v4 as uuid } from 'uuid';
import { type CoreMessage, generateText } from 'ai';
import { getModel } from 'react-native-ai';
import { AI_BOT, USER, LLM_GENERATION_CONFIG } from '../utils/constants';

interface UseChatMessagesProps {
  modelId: string;
  initialMessages?: IMessage[];
  getContextForQuery?: (query: string) => Promise<string | null>;
  contextEnabled?: boolean;
  contextAvailable?: boolean;
}

export const useChatMessages = ({
  modelId,
  initialMessages = [],
  getContextForQuery,
  contextEnabled = false,
  contextAvailable = false,
}: UseChatMessagesProps) => {
  const [displayedMessages, setDisplayedMessages] = useState<IMessage[]>(initialMessages);
  const [text, setText] = useState<string>('');

  const updateMessages = useCallback((updater: IMessage[] | ((prev: IMessage[]) => IMessage[])) => {
    if (typeof updater === 'function') {
      setDisplayedMessages(updater);
    } else {
      setDisplayedMessages(updater);
    }
  }, []);

  const sendMessage = useCallback(
    async (userMessage: IMessage, currentMessages: IMessage[]) => {
      if (!modelId) return;

      try {
        const userQuery = userMessage.text || '';
        
        console.log('🔄 Current context state - enabled:', contextEnabled, 'available:', contextAvailable);
        
        // Check if context is enabled and available before getting context
        let contextContent = null;
        if (contextEnabled && contextAvailable && getContextForQuery) {
          console.log('🔍 Context enabled - getting context for query');
          contextContent = await getContextForQuery(userQuery);
        } else {
          console.log('❌ Context disabled or unavailable - contextEnabled:', contextEnabled, 'contextAvailable:', contextAvailable);
        }
        
        // Prepare message history (previous messages only, excluding current)
        const messageHistory = currentMessages
          .reverse()
          .map((message: IMessage): CoreMessage => ({
            content: message.text,
            role: message.user._id === 2 ? 'assistant' : 'user',
          }));

        // Prepare the current user message
        let currentUserContent = userQuery;
        
        // Add context to current user message if available
        if (contextContent) {
          console.log('🚀 Adding context to user message - Length:', contextContent.length);
          currentUserContent = `${contextContent}\n\nUser Question: ${userQuery}`;
        } else {
          console.log('❌ No context content to add to LLM prompt');
        }
        
        // Build the final message array: previous messages + current enhanced message
        const enhancedMessageHistory: CoreMessage[] = [
          ...messageHistory,
          {
            content: currentUserContent,
            role: 'user' as const
          }
        ];
        
        console.log('📝 Final messages being sent to LLM:', 
          enhancedMessageHistory.map(m => ({ role: m.role, contentLength: m.content.length }))
        );
        
        // Generate response with context-enhanced messages
        const { text } = await generateText({
          model: getModel(modelId) as any,
          ...LLM_GENERATION_CONFIG,
          messages: enhancedMessageHistory,
        });
        
        // Add AI response
        const aiMessage: IMessage = {
          _id: uuid(),
          text: text,
          createdAt: new Date(),
          user: AI_BOT,
        };

        updateMessages(prev => [aiMessage, ...prev]);
      } catch (error) {
        const errorMessage: IMessage = {
          _id: uuid(),
          text: 'Error: ' + (error instanceof Error ? error.message : String(error)),
          createdAt: new Date(),
          user: AI_BOT,
        };
        updateMessages(prev => [errorMessage, ...prev]);
      }
    },
    [modelId, contextEnabled, contextAvailable, getContextForQuery, updateMessages]
  );

  const onSend = useCallback(
    (newMessage: IMessage[]) => {
      if (newMessage[0]) {
        const userMessage = {
          ...newMessage[0],
          user: USER,
        };
        
        updateMessages(prev => {
          const newMessages = [userMessage, ...prev];
          // Send message with current message state
          sendMessage(userMessage, prev);
          return newMessages;
        });
        setText('');
      }
    },
    [sendMessage, updateMessages]
  );

  return {
    displayedMessages,
    text,
    setText,
    onSend,
    updateMessages,
  };
}; 