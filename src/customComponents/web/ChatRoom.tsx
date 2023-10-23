import React from "react";
import ChatRoomNav from "./ChatRoomNav";

const ChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  return (
    <div>
      <ChatRoomNav />
    </div>
  );
};

export default ChatRoom;
