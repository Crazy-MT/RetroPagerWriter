export interface MessageCardData {
  id: string;
  text: string;
  timestamp: string;
  x: number;
  y: number;
  rotation: number;
  theme: 'classic' | 'urgent' | 'love';
}

export enum PagerStatus {
  IDLE = 'READY',
  TYPING = 'TYPING...',
  PROCESSING = 'ENCRYPTING...',
  SENDING = 'SENDING...',
  ERROR = 'ERR_01'
}
