import { create } from 'zustand';
import { CircleMember } from '../types/circle';

interface CircleState {
  members: CircleMember[];
  addMember: (name: string, avatar: string) => void;
}

const mockMembers: CircleMember[] = [
  {
    id: '1',
    userId: 'mock-user-1',
    memberUserId: 'member-1',
    name: 'Alex',
    avatar: '🦊',
    isOnline: true,
    lastMessage: 'Hey, how are you doing?',
    lastMessageAt: new Date(Date.now() - 300000),
    addedAt: new Date('2026-03-01'),
  },
  {
    id: '2',
    userId: 'mock-user-1',
    memberUserId: 'member-2',
    name: 'Jordan',
    avatar: '🌻',
    isOnline: true,
    lastMessage: 'Let me know if you need anything',
    lastMessageAt: new Date(Date.now() - 3600000),
    addedAt: new Date('2026-03-02'),
  },
  {
    id: '3',
    userId: 'mock-user-1',
    memberUserId: 'member-3',
    name: 'Sam',
    avatar: '🐻',
    isOnline: false,
    lastMessage: 'Take care of yourself 💛',
    lastMessageAt: new Date(Date.now() - 86400000),
    addedAt: new Date('2026-03-05'),
  },
  {
    id: '4',
    userId: 'mock-user-1',
    memberUserId: 'member-4',
    name: 'Riley',
    avatar: '🌈',
    isOnline: false,
    lastMessage: 'Miss you!',
    lastMessageAt: new Date(Date.now() - 172800000),
    addedAt: new Date('2026-03-07'),
  },
];

export const useCircleStore = create<CircleState>((set) => ({
  members: mockMembers,
  addMember: (name, avatar) => {
    const member: CircleMember = {
      id: Date.now().toString(),
      userId: 'mock-user-1',
      memberUserId: `member-${Date.now()}`,
      name,
      avatar,
      isOnline: false,
      addedAt: new Date(),
    };
    set((state) => ({ members: [...state.members, member] }));
  },
}));
