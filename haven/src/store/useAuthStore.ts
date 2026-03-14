import { create } from 'zustand';

interface AuthState {
  userId: string;
  displayName: string;
  emoji: string;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
  setOnboardingComplete: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: 'mock-user-1',
  displayName: 'You',
  emoji: '🌸',
  isAuthenticated: true,
  onboardingComplete: false,
  createdAt: new Date('2026-03-01'),
  setOnboardingComplete: (val) => set({ onboardingComplete: val }),
}));
