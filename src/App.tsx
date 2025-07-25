import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './theme/ThemeContext';
import ModelSelectionScreen from './screens/ModelSelectionScreen';
import ChatScreen from './screens/ChatScreen';

export type RootStackParamList = {
  ModelSelection: undefined;
  Chat: { modelId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ModelSelection" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ModelSelection" component={ModelSelectionScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </ThemeProvider>
);

export default App;
