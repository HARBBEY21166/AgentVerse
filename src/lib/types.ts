export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  audioSrc?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
