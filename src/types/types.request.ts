import Stranger from "./types.stranger";

type ChatRequest = {
  senderId: string;
  receiverId: string;
  isRead: boolean;
  sender: Stranger;
  receiver: Stranger;
  id?: string;
};

export default ChatRequest;
