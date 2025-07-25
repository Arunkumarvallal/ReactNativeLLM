import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { ThemeType } from '../theme/theme';
import { WifiHigh, LinkBreak } from 'phosphor-react-native';

interface NetworkInfoProps {
  theme: ThemeType;
}

const NetworkInfo: React.FC<NetworkInfoProps> = ({ theme }) => {
  const netInfo = useNetInfo();
  const isWifiConnected = netInfo.type === 'wifi' && netInfo.isConnected;

  return (
    <View style={styles.container}>
      {isWifiConnected ? (
        <WifiHigh size={22} color={theme.text} weight="fill" />
      ) : (
        <LinkBreak size={22} color={theme.text} weight="fill" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default NetworkInfo;
