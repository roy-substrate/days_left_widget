export type MoodType = 'happy' | 'calm' | 'sad' | 'angry' | 'anxious' | 'tired';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  note?: string;
  createdAt: Date;
}

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Happy', color: '#FFD60A' },
  calm: { emoji: '😌', label: 'Calm', color: '#64D2FF' },
  sad: { emoji: '😔', label: 'Sad', color: '#5E5CE6' },
  angry: { emoji: '😤', label: 'Angry', color: '#FF375F' },
  anxious: { emoji: '😰', label: 'Anxious', color: '#FF9F0A' },
  tired: { emoji: '😴', label: 'Tired', color: '#8E8E93' },
};
