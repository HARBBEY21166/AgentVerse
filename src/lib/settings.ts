
export const SETTINGS_KEY = 'agentSettings';
export const USER_PROFILE_KEY = 'userProfile';

export const DEFAULT_SETTINGS = {
  agentName: 'AgentVerse',
  agentRole: 'helpful-assistant',
  agentInstructions: 'You are a helpful AI assistant. Be concise and clear in your responses.',
};

export type AgentSettings = typeof DEFAULT_SETTINGS;

export const DEFAULT_USER_PROFILE = {
  name: 'Abiodun Abbey Aina',
};

export type UserProfile = typeof DEFAULT_USER_PROFILE;
