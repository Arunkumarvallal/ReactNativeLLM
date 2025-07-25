import { useState, useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { prepareModel } from 'react-native-ai';
import { v4 as uuid } from 'uuid';
import { AI_BOT } from '../utils/constants';

interface UseModelPreparationProps {
  modelId?: string;
  initialPreparing?: boolean;
  initialPrepared?: boolean;
  onMessagesUpdate?: (updater: (prev: IMessage[]) => IMessage[]) => void;
}

export const useModelPreparation = ({
  modelId,
  initialPreparing = true,
  initialPrepared = false,
  onMessagesUpdate,
}: UseModelPreparationProps) => {
  const [preparing, setPreparing] = useState<boolean>(initialPreparing);
  const [prepared, setPrepared] = useState<boolean>(initialPrepared);

  useEffect(() => {
    let isMounted = true;

    if (modelId && !prepared) {
      setPreparing(true);
      
      // Add preparing message
      onMessagesUpdate?.((previousMessages) => [
        {
          _id: 'preparing',
          text: 'Preparing model, please wait...',
          createdAt: new Date(),
          user: AI_BOT,
        },
        ...previousMessages,
      ]);

      prepareModel(modelId)
        .then(() => {
          if (isMounted) {
            setPreparing(false);
            setPrepared(true);
            
            // Add ready message
            onMessagesUpdate?.((previousMessages) => [
              {
                _id: 'ready',
                text: 'Model ready for conversation!',
                createdAt: new Date(),
                user: AI_BOT,
              },
              ...previousMessages,
            ]);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setPreparing(false);
            
            // Add error message
            onMessagesUpdate?.((previousMessages) => [
              {
                _id: uuid(),
                text: 'Error preparing model: ' + (error instanceof Error ? error.message : String(error)),
                createdAt: new Date(),
                user: AI_BOT,
              },
              ...previousMessages,
            ]);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [modelId, prepared]); // Removed onMessagesUpdate from dependencies

  return {
    preparing,
    prepared,
  };
}; 