import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SunIcon, MoonIcon } from 'phosphor-react-native';
import { darkTheme } from '../theme/theme';

interface ThemeToggleButtonProps {
  style?: ViewStyle;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ style }) => {
  const { theme, themeOverride, toggleTheme, setThemeOverride } = useTheme();
  const isDark = theme === darkTheme;
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      onLongPress={() => setThemeOverride(null)}
      style={[styles.button, style]}
      accessibilityLabel="Toggle theme"
    >
      {isDark ? (
        <MoonIcon size={24} color={theme.text} weight="fill" />
      ) : (
        <SunIcon size={24} color={theme.text} weight="fill" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ThemeToggleButton;
