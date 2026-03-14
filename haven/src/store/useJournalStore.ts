import { create } from 'zustand';
import { JournalEntry } from '../types/journal';

const PROMPTS = [
  'What made you smile today?',
  'What are you grateful for right now?',
  'How are you really feeling today?',
  'What would make today a little better?',
  'Write about something you\'re proud of.',
  'What\'s been on your mind lately?',
  'Describe a moment of peace you experienced recently.',
];

interface JournalState {
  entries: JournalEntry[];
  addEntry: (prompt: string, content: string, mood?: string) => void;
  getTodayPrompt: () => string;
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    userId: 'mock-user-1',
    prompt: 'What made you smile today?',
    content: 'My friend sent me a funny meme and it made my whole morning better. Sometimes the smallest things matter most.',
    mood: '😊',
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: '2',
    userId: 'mock-user-1',
    prompt: 'How are you really feeling today?',
    content: 'A bit overwhelmed with work but trying to take it one step at a time. Breathing helps.',
    mood: '😰',
    createdAt: new Date(Date.now() - 1 * 86400000),
  },
];

export const useJournalStore = create<JournalState>((set) => ({
  entries: mockEntries,
  addEntry: (prompt, content, mood) => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      userId: 'mock-user-1',
      prompt,
      content,
      mood,
      createdAt: new Date(),
    };
    set((state) => ({ entries: [entry, ...state.entries] }));
  },
  getTodayPrompt: () => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return PROMPTS[dayOfYear % PROMPTS.length];
  },
}));
