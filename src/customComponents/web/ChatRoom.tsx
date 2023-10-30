import React, { useEffect } from "react";
import ChatRoomNav from "./ChatRoomNav";
import ChatRoomFooter from "./ChatRoomFooter";
import Message from "./Message";
import useChat from "@/hooks/useChat";
import TailwindSpinner from "./TailwindSpinner";

const ChatRoom = () => {
  const {
    activeRoomMessages,
    getActiveRoomMessages,
    scrollSectionToBottom,
    sectionRefMessagesDiv,
  } = useChat();

  useEffect(() => {
    getActiveRoomMessages();
  }, []);

  useEffect(() => {
    scrollSectionToBottom();
  }, [activeRoomMessages.data.length]);

  return (
    <main className="flex flex-col justify-between min-h-full">
      <ChatRoomNav />
      <section
        className="px-6 flex flex-col gap-y-2 min-h-[64vh] max-h-[64vh] overflow-y-scroll py-4 h-32 scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit"
        ref={sectionRefMessagesDiv}
      >
        {activeRoomMessages.status === "idle" ? (
          activeRoomMessages.data?.length ? (
            activeRoomMessages.data.map((msg, i) => (
              <Message msg={msg} key={i} />
            ))
          ) : null
        ) : (
          <section className="flex flex-col justify-center items-center min-h-full">
            <TailwindSpinner />
          </section>
        )}
      </section>
      <ChatRoomFooter />
    </main>
  );
};

export default ChatRoom;
