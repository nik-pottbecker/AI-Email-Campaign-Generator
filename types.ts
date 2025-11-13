export interface Campaign {
  subjectLines: string[];
  body: string;
  imagePrompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
