import React, { useEffect } from "react";
import ChatRoomNav from "./ChatRoomNav";
import ChatRoomFooter from "./ChatRoomFooter";
import Message from "./Message";
import useChat from "@/hooks/useChat";
import TailwindSpinner from "./TailwindSpinner";
import { usePageVisibility } from "react-page-visibility";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ChatRoom = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const isVisible = usePageVisibility();
  const createdAt =
    activeRoom.roomDetails &&
    new Date(activeRoom.roomDetails.createdAt).toLocaleDateString();
  // This is current room Data
  const roomMessages: Message[] | null =
    activeRoom.roomDetails?.id && activeRoom.messages?.data
      ? activeRoom.messages?.data[activeRoom.roomDetails.id]
      : null;
  const status = activeRoom.messages.status;
  // --------------------------
  const { scrollSectionToBottom, sectionRefMessagesDiv, updateMessagesOnSeen } =
    useChat();

  useEffect(() => {
    scrollSectionToBottom();
  }, [roomMessages?.length, activeRoom.roomDetails?.id!]);

  useEffect(() => {
    if (roomMessages?.length && isVisible) updateMessagesOnSeen();
  }, [roomMessages?.length, activeRoom.chatWith?.uid, isVisible]);

  return (
    <main className="sm:min-h-full min-h-[100vh] w-full flex flex-col max-h-full">
      <section>
        <ChatRoomNav />
      </section>
      {status === "idle" ? (
        <section
          className="flex flex-col max-h-full flex-1 gap-y-2 p-6 overflow-y-scroll sm:scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit"
          ref={sectionRefMessagesDiv}
        >
          {activeRoom.roomDetails ? (
            <section className="flex justify-center">
              <span className="px-4 py-1 bg-gray-900 text-gray-400 rounded-lg">
                {createdAt}
              </span>
            </section>
          ) : null}
          {/* All Messages */}
          <section className="flex flex-col w-full gap-y-5">
            {roomMessages?.length
              ? roomMessages.map((msg) => <Message msg={msg} key={msg.id} />)
              : null}
          </section>
          {/* --- */}
        </section>
      ) : (
        <section className="flex flex-col max-h-full flex-1 justify-center items-center">
          <TailwindSpinner />
        </section>
      )}
      <section>
        <ChatRoomFooter />
      </section>
    </main>
  );
};

export default ChatRoom;
