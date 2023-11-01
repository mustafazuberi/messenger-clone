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
  }, [activeRoomMessages.data.length, activeRoom.chatWith?.uid]);

  return (
    <main className="flex flex-col justify-between min-h-[90vh] max-h-[90vh]">
      <ChatRoomNav />
      {activeRoomMessages.status === "idle" ? (
        <section
          // className="  justify-end  h-[64vh] "
          className="flex flex-col flex-1 gap-y-2 px-6 pt-4 pb-0 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit"
          ref={sectionRefMessagesDiv}
        >
          {activeRoomMessages.data?.length
            ? activeRoomMessages.data.map((msg, i) => (
                <Message msg={msg} key={i} />
              ))
            : null}
        </section>
      ) : (
        <section className="flex flex-col justify-center items-center min-h-full">
          <TailwindSpinner />
        </section>
      )}
      <ChatRoomFooter />
    </main>
  );
};

export default ChatRoom;
