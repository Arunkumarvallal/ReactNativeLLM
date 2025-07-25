// Theme definitions for light and dark mode

export const lightTheme = {
  background: '#fff',
  text: '#000',
  border: '#E0E0E0',
  accent: '#34C759',
  secondaryBackground: '#f5f5f5',
  chipBackground: '#F5F5F5',
  chipText: '#222',
  placeholder: '#888',
  itemSelected: '#F0FFF5',
  itemBorder: '#F0F0F0',
  bubbleLeft: '#f0f0f0',
  bubbleRight: '#34C759',
  inputBackground: '#fff',
  progressBackground: '#2A2A2A',
  progressBar: '#007AFF', // blue for progress bar
  progressText: '#FFFFFF',
  downloadIcon: '#007AFF', // blue for light
};

export const darkTheme: typeof lightTheme = {
  background: '#121212',
  text: '#fff',
  border: '#333',
  accent: '#34C759',
  secondaryBackground: '#222',
  chipBackground: '#222',
  chipText: '#fff',
  placeholder: '#aaa',
  itemSelected: '#1e2e1e',
  itemBorder: '#222',
  bubbleLeft: '#222',
  bubbleRight: '#34C759',
  inputBackground: '#1e1e1e',
  progressBackground: '#444',
  progressBar: '#007AFF', // blue for progress bar
  progressText: '#FFFFFF',
  downloadIcon: '#007AFF', // green for dark
};

export type ThemeType = typeof lightTheme; 