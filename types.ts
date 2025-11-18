export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppSection {
  HERO = 0,
  FEATURES = 1,
  VISION = 2,
  CONTACT = 3
}