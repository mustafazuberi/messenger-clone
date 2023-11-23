"use client";
import ChatRoom from "@/customComponents/web/ChatRoom";
import useAudioCall from "@/hooks/useAudioCall";
import { RootState } from "@/store";
import { CALL_STATUS, CALL_TYPE } from "@/types/types.call";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const { activeCall } = useSelector((state: RootState) => state.calls);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { handleAudioCall, getCurrentUserCalls } = useAudioCall();

  useEffect(() => {
    (async () => {
      if (
        activeCall?.type === CALL_TYPE.AUDIO &&
        activeCall.callStatus === CALL_STATUS.ONGOING
      ) {
        await handleAudioCall();
      }
    })();
  }, [activeCall]);

  useEffect(() => {
    getCurrentUserCalls();
  }, [currentUser.uid]);

  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const roomId = roomDetails?.id;
  if (!roomId) {
    return (
      <main className="lg:flex md:flex hidden justify-center items-center min-w-full">
        <section className="max-w-[80%]">
          <h1 className=" text-[60px] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
            No Chats Selected
          </h1>
        </section>
      </main>
    );
  }

  return (
    <section
      className={`w-full min-h-full max-h-full lg:flex md:flex ${
        !roomId ? "hidden" : "flex"
      } flex-1`}
    >
      <ChatRoom />
    </section>
  );
};

export default page;
