import Friend from "./type.friend";
import Message from "./types.message";
import User from "./types.user";

type Room = {
  id?: string;
  lastMessage: Message | null;
  lastConversation: number | null;
  users: { [x: string]: boolean };
  createdAt: number;
  userDetails: { [x: string]: User };
};

export default Room;
