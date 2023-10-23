"use client"

import ChatRoom from "@/customComponents/web/ChatRoom";
import { useSearchParams } from "next/navigation";

const page = () => {
  const params = useSearchParams();
  const chatRoomId = params.get("chatroom");

  if (!chatRoomId) {
    return (
      <main className="flex justify-center items-center w-full">
        <h1 className=" text-2xl font-extrabold tracking-tight lg:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          No Chats Selected
        </h1>
      </main>
    );
  }
  return (
    <div className="w-full">
      <ChatRoom chatRoomId={chatRoomId} />
    </div>
  );
};

export default page;
