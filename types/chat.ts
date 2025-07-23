export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  files?: { name: string; type: string }[];
}