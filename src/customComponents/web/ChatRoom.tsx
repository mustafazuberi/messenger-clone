import React, { useEffect } from "react";
import ChatRoomNav from "./ChatRoomNav";
import ChatRoomFooter from "./ChatRoomFooter";
import Message from "./Message";
import useChat from "@/hooks/useChat";
import TailwindSpinner from "./TailwindSpinner";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ChatRoom = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const {
    activeRoomMessages,
    getActiveRoomMessages,
    scrollSectionToBottom,
    sectionRefMessagesDiv,
    updateActiveRoomUnseenMessagesToSeen,
  } = useChat();

  useEffect(() => {
    getActiveRoomMessages();
  }, [activeRoom.chatWith?.uid]);

  useEffect(() => {
    scrollSectionToBottom();
  }, [activeRoomMessages.data.length]);

  useEffect(() => {
    if (activeRoomMessages.data.length) updateActiveRoomUnseenMessagesToSeen();
  }, [activeRoomMessages.data.length]);

  return (
    <main className="flex flex-col justify-between min-h-[90vh] max-h-[90vh]">
      <ChatRoomNav />
      <section
        className="px-6 flex flex-col justify-end gap-y-2 min-h-full max-h-full flex-1 overflow-y-scroll py-4 h-32 scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit"
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
