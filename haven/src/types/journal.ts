export interface JournalEntry {
  id: string;
  userId: string;
  prompt: string;
  content: string;
  mood?: string;
  createdAt: Date;
}
