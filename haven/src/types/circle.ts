export interface CircleMember {
  id: string;
  userId: string;
  memberUserId: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: string;
  lastMessageAt?: Date;
  addedAt: Date;
}
