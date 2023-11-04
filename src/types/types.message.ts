import Friend from "./type.friend";

type Message = {
  id?: string;
  text?: string;
  img?: string;
  friend?: Friend;
  senderId: string;
  date: number;
  seen: boolean;
  delivered: boolean;
};

export default Message;
