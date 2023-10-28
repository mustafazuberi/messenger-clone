type Message = {
  id?: string;
  text?: string;
  img?: string;
  senderId: string;
  date: number;
  seen: boolean;
};

export default Message;
