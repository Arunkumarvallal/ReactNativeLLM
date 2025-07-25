import React from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer, type IMessage } from 'react-native-gifted-chat';
import { UserIcon, RobotIcon } from 'phosphor-react-native';
import { useTheme } from '../theme/ThemeContext';
import { AVATAR_SIZE, AVATAR_RADIUS, USER } from '../utils/constants';

interface CustomGiftedChatProps {
  messages: IMessage[];
  onSend: (messages: IMessage[]) => void;
  text: string;
  onInputTextChanged: (text: string) => void;
}

const CustomGiftedChat: React.FC<CustomGiftedChatProps> = ({
  messages,
  onSend,
  text,
  onInputTextChanged,
}) => {
  const { theme } = useTheme();

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { backgroundColor: theme.bubbleLeft },
        right: { backgroundColor: theme.bubbleRight },
      }}
      textStyle={{
        left: { color: theme.text, fontSize: 14 },
        right: { color: theme.text, fontSize: 14 },
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{ backgroundColor: theme.inputBackground }}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={{ color: theme.text, fontSize: 14 }}
      placeholderTextColor={theme.placeholder}
    />
  );

  const renderAvatar = (props: any) => {
    const { currentMessage } = props;
    console.log('renderAvatar called for:', currentMessage);
    
    if (currentMessage?.user?._id === USER._id) {
      // User avatar
      return (
        <View style={{
          width: AVATAR_SIZE, 
          height: AVATAR_SIZE, 
          borderRadius: AVATAR_RADIUS, 
          backgroundColor: theme.secondaryBackground, 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden', 
          marginRight: 4
        }}>
          <UserIcon size={24} color={theme.downloadIcon} weight="fill" />
        </View>
      );
    } else if (currentMessage?.user?._id === 2) {
      // AI bot avatar
      return (
        <View style={{ 
          width: AVATAR_SIZE, 
          height: AVATAR_SIZE, 
          borderRadius: AVATAR_RADIUS, 
          overflow: 'hidden', 
          marginRight: 4 
        }}>
          <RobotIcon size={24} color={theme.downloadIcon} weight="fill" />
        </View>
      );
    }
    return null;
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{ ...USER, avatar: '' }}
      text={text}
      onInputTextChanged={onInputTextChanged}
      showAvatarForEveryMessage={true}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      renderComposer={renderComposer}
      renderAvatar={renderAvatar}
      renderAvatarOnTop={true}
      messagesContainerStyle={{ backgroundColor: theme.background }}
    />
  );
};

export default CustomGiftedChat; 