import { useState } from "react";

const useChat = () => {
  const [message, setMessage] = useState<string>("");

  const createChatRoom = () => {};

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("send message function run!");
  };

  return { createChatRoom, sendMessage, message ,setMessage};
};

export default useChat;
