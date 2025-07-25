// App-wide constants and shared values

export const AI_BOT = {
  _id: 2,
  name: 'AI Chat Bot',
} as const;

export const USER = {
  _id: 1,
  name: 'You',
  avatar: 'user',
} as const;

// UI Constants
export const AVATAR_SIZE = 36;
export const AVATAR_RADIUS = 18;

// File paths
export const DOWNLOADED_MODELS_DIR = 'downloaded_models';

// Model configuration
export const MODEL_CONFIG_PATH = (modelId: string) => 
  `bundle/${modelId}/mlc-chat-config.json`;

// LLM Generation settings
export const LLM_GENERATION_CONFIG = {
  temperature: 0.6,
} as const; 