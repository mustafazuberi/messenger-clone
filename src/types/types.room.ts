import Friend from "./type.friend";
import Message from "./types.message";

type Room = {
  id?: string;
  lastMessage: Message | null;
  lastConversation: number | null;
  users: { [x: string]: boolean };
  createdAt: number;
};

export default Room;
