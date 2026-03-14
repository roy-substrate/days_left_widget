import { create } from 'zustand';
import { MoodEntry, MoodType } from '../types/mood';

interface MoodState {
  entries: MoodEntry[];
  addEntry: (mood: MoodType, note?: string) => void;
  getWeekEntries: () => MoodEntry[];
}

const now = new Date();
const mockEntries: MoodEntry[] = [
  { id: '1', userId: 'mock-user-1', mood: 'happy', createdAt: new Date(now.getTime() - 6 * 86400000) },
  { id: '2', userId: 'mock-user-1', mood: 'calm', createdAt: new Date(now.getTime() - 5 * 86400000) },
  { id: '3', userId: 'mock-user-1', mood: 'anxious', note: 'Big presentation tomorrow', createdAt: new Date(now.getTime() - 4 * 86400000) },
  { id: '4', userId: 'mock-user-1', mood: 'sad', createdAt: new Date(now.getTime() - 3 * 86400000) },
  { id: '5', userId: 'mock-user-1', mood: 'happy', note: 'Great day with friends', createdAt: new Date(now.getTime() - 2 * 86400000) },
  { id: '6', userId: 'mock-user-1', mood: 'calm', createdAt: new Date(now.getTime() - 1 * 86400000) },
  { id: '7', userId: 'mock-user-1', mood: 'happy', createdAt: now },
];

export const useMoodStore = create<MoodState>((set, get) => ({
  entries: mockEntries,
  addEntry: (mood, note) => {
    const entry: MoodEntry = {
      id: Date.now().toString(),
      userId: 'mock-user-1',
      mood,
      note,
      createdAt: new Date(),
    };
    set((state) => ({ entries: [...state.entries, entry] }));
  },
  getWeekEntries: () => {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return get().entries.filter((e) => e.createdAt >= weekAgo);
  },
}));
