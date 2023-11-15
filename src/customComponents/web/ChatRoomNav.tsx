import { IoCallSharp } from "react-icons/io5";
import { BsFillCameraVideoFill } from "react-icons/bs";
import ChatRoomFriendInfo from "./ChatRoomInfo";
import UserImageAvatar from "./UserImageAvatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { LastActive } from "./ChatUsers";
import { IoIosArrowBack } from "react-icons/io";
import { clearActiveRoom } from "@/store/slice/activeRoomSlice";

const ChatRoomNav = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const dispatch = useDispatch();
  return (
    <main className="flex flex-row justify-between border-b lg:px-5 md:px-5 px-2 py-3">
      <section className="flex flex-row gap-x-2 items-center">
        <section className="lg:hidden md:hidden block">
          <IoIosArrowBack
            className="text-2xl"
            onClick={() => dispatch(clearActiveRoom())}
          />
        </section>
        {activeRoom.chatWith && (
          <UserImageAvatar user={activeRoom.chatWith} size={10} />
        )}
        <section className="flex flex-col">
          <section>{activeRoom.chatWith?.displayName}</section>
          <LastActive friend={activeRoom.chatWith!} />
        </section>
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
