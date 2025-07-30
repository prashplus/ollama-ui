export interface IOllamaResponsePart {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';
