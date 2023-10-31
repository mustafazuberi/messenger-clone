import Image from "next/image";
import { IoCallSharp } from "react-icons/io5";
import { BsFillCameraVideoFill } from "react-icons/bs";
import ChatRoomFriendInfo from "./ChatRoomInfo";
import UserImageAvatar from "./UserImageAvatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ChatRoomNav = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  return (
    <main className="flex flex-row py-3 justify-between border-b sm:px-5 px-2 ">
      <section className="flex flex-row gap-x-2 items-center">
        {activeRoom.chatWith && (
          <UserImageAvatar user={activeRoom.chatWith} size={10} />
        )}
        {activeRoom.chatWith?.displayName}
      </section>
      <section className="flex flex-row gap-x-4 items-center justify-center">
        <IoCallSharp className="text-2xl cursor-pointer" />
        <BsFillCameraVideoFill className="text-2xl cursor-pointer" />
        {activeRoom.chatWith && (
          <ChatRoomFriendInfo chatWith={activeRoom.chatWith} />
        )}
      </section>
    </main>
  );
};

export default ChatRoomNav;
