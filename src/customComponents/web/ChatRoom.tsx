import React from "react";
import ChatRoomNav from "./ChatRoomNav";
import ChatRoomFooter from "./ChatRoomFooter";

const ChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  return (
    <main className="flex flex-col justify-between min-h-full">
      <ChatRoomNav />
      <ChatRoomFooter />
    </main>
  );
};

export default ChatRoom;
