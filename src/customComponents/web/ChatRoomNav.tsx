import Image from "next/image";
import { IoCallSharp } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";

const ChatRoomNav = () => {
  return (
    <main className="sm:px-5 px-2 flex flex-row py-4 justify-between border-b">
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
        <FaInfoCircle className="text-2xl cursor-pointer" />
      </section>
    </main>
  );
};

export default ChatRoomNav;
