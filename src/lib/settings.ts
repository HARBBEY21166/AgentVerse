
export const SETTINGS_KEY = 'agentSettings';

export const DEFAULT_SETTINGS = {
  agentName: 'AgentVerse',
  agentRole: 'helpful-assistant',
  agentInstructions: 'You are a helpful AI assistant. Be concise and clear in your responses.',
};

export type AgentSettings = typeof DEFAULT_SETTINGS;
