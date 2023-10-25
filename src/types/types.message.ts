type Message = {
  id?: string;
  text?: string;
  img?: string;
  senderId: string;
  date: Date;
  seen: boolean;
};

export default Message;
