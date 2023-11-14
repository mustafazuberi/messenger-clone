import Message from "./types.message";
import User from "./types.user";

export type Block = {
  isBlocked: boolean;
  blockedBy: { [x: string]: User | null };
};

type Room = {
  id?: string;
  lastMessage: Message | null;
  lastConversation: number | null;
  users: { [x: string]: boolean };
  createdAt: number;
  userDetails: { [x: string]: User };
  block?: Block;
};

export default Room;
