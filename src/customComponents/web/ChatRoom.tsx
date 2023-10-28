import React, { useEffect } from "react";
import ChatRoomNav from "./ChatRoomNav";
import ChatRoomFooter from "./ChatRoomFooter";
import Message from "./Message";
import useChat from "@/hooks/useChat";
import TailwindSpinner from "./TailwindSpinner";

const ChatRoom = ({ chatRoomId }: { chatRoomId: string }) => {
  const { activeRoomMessages, getActiveRoomMessages, getActiveRoom } =
    useChat();

  useEffect(() => {
    getActiveRoomMessages(chatRoomId);
    getActiveRoom(chatRoomId);
  }, []);

  return (
    <main className="flex flex-col justify-between min-h-full">
      <ChatRoomNav />
      <section className="px-6 flex flex-col gap-y-2 max-h-[64vh] overflow-y-scroll py-4">
        {activeRoomMessages.status === "idle" ? (
          activeRoomMessages.data?.length &&
          activeRoomMessages.data.map((msg, i) => <Message msg={msg} key={i} />)
        ) : (
          <section className="flex justify-center items-center">
            <TailwindSpinner />
          </section>
        )}
      </section>
      <ChatRoomFooter />
    </main>
  );
};

export default ChatRoom;
