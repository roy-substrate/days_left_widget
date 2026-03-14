import { create } from 'zustand';
import { Message } from '../types/chat';

interface ChatState {
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, text: string) => void;
  getMessages: (chatId: string) => Message[];
}

const mockMessages: Record<string, Message[]> = {
  'member-1': [
    { id: '1', chatId: 'member-1', fromUserId: 'member-1', text: 'Hey, how are you doing?', createdAt: new Date(Date.now() - 600000), read: true },
    { id: '2', chatId: 'member-1', fromUserId: 'mock-user-1', text: 'I\'m okay, just needed to talk', createdAt: new Date(Date.now() - 500000), read: true },
    { id: '3', chatId: 'member-1', fromUserId: 'member-1', text: 'I\'m here for you, always 💛', createdAt: new Date(Date.now() - 400000), read: true },
    { id: '4', chatId: 'member-1', fromUserId: 'mock-user-1', text: 'Thank you, that means a lot', createdAt: new Date(Date.now() - 300000), read: true },
  ],
  'member-2': [
    { id: '5', chatId: 'member-2', fromUserId: 'member-2', text: 'Let me know if you need anything', createdAt: new Date(Date.now() - 3600000), read: true },
    { id: '6', chatId: 'member-2', fromUserId: 'mock-user-1', text: 'Will do, thanks for checking in', createdAt: new Date(Date.now() - 3500000), read: true },
  ],
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: mockMessages,
  sendMessage: (chatId, text) => {
    const message: Message = {
      id: Date.now().toString(),
      chatId,
      fromUserId: 'mock-user-1',
      text,
      createdAt: new Date(),
      read: false,
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    }));
  },
  getMessages: (chatId) => get().messages[chatId] || [],
}));
