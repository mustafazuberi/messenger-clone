import Friend from "./type.friend";

type Message = {
  id?: string;
  text?: string;
  img?: string;
  voice?: string;
  friend?: Friend;
  senderId: string;
  date: number;
  seen: boolean;
  delivered: boolean;
  type?: "text" | "voice" | "image" | "friend" | "audio call" | "video call";
};

export default Message;
