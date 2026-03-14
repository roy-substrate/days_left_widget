export interface Message {
  id: string;
  chatId: string;
  fromUserId: string;
  text: string;
  createdAt: Date;
  read: boolean;
}
