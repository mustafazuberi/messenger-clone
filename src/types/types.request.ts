import User from "./types.user";

type ChatRequest = {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  sender: User;
  receiver: User;
  id?: string;
};

export default ChatRequest;
