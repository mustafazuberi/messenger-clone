import React, { useEffect, useMemo } from "react";
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

  const createdAt = useMemo(() => {
    return activeRoom.roomDetails
      ? new Date(activeRoom.roomDetails.createdAt).toDateString()
      : "";
  }, [activeRoom.roomDetails?.createdAt]);

  const roomMessages = useMemo(() => {
    if (activeRoom.roomDetails?.id && activeRoom.messages?.data) {
      return activeRoom.messages.data[activeRoom.roomDetails.id] || null;
    }
    return null;
  }, [activeRoom.roomDetails?.id, activeRoom.messages]);

  const status = activeRoom.messages.status;
  const {
    scrollSectionToBottom,
    sectionRefMessagesDiv,
    updateMessagesOnSeen,
    getActiveRoomBlockInfoRealTime,
  } = useChat();

  useEffect(() => {
    if (activeRoom.roomDetails?.id) {
      scrollSectionToBottom();
    }
  }, [roomMessages?.length, activeRoom.roomDetails?.id]);

  useEffect(() => {
    if (roomMessages?.length && isVisible) updateMessagesOnSeen();
  }, [roomMessages?.length, activeRoom.chatWith?.uid, isVisible]);

  // This is for getting real time updates of block unblock
  useEffect(() => {
    if (activeRoom.roomDetails?.id)
      getActiveRoomBlockInfoRealTime(activeRoom.roomDetails?.id);
  }, [activeRoom.roomDetails?.id]);

  return (
    <main className="lg:min-h-full md:min-h-full min-h-[100vh] w-full flex flex-col max-h-full">
      <section>
        <ChatRoomNav />
      </section>
      {status === "idle" ? (
        <section
          className="flex flex-col max-h-full flex-1 gap-y-2 p-6 overflow-y-scroll lg:scrollbar md:scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit"
          ref={sectionRefMessagesDiv}
        >
          {activeRoom.roomDetails ? (
            <section className="flex justify-center">
              <span className="px-4 py-1 bg-gray-300 dark:bg-gray-700 ">
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
