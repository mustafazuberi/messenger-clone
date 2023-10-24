import Image from "next/image";
import { IoCallSharp } from "react-icons/io5";
import { BsFillCameraVideoFill } from "react-icons/bs";
import ChatRoomFriendInfo from "./ChatRoomInfo";

const ChatRoomNav = () => {
  return (
    <main className="flex flex-row py-4 justify-between border-b sm:px-5 px-2 ">
      <section className="flex flex-row gap-x-2 items-center">
        <Image
          src={
            "https://lh3.googleusercontent.com/a/ACg8ocIuszNvzmY5l1JypLVpg3iQEGSBsW3BpqJoesOP7FbqMA0=s260-c-no"
          }
          alt="chatRoomFriend"
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
        />
        Mustafa Zuberi
      </section>
      <section className="flex flex-row gap-x-4 items-center justify-center">
        <IoCallSharp className="text-2xl cursor-pointer" />
        <BsFillCameraVideoFill className="text-2xl cursor-pointer" />
        <ChatRoomFriendInfo />
      </section>
    </main>
  );
};

export default ChatRoomNav;
