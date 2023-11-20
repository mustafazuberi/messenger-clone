import ChatRoomFriendInfo from "./ChatRoomInfo";
import UserImageAvatar from "./UserImageAvatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { LastActive } from "./ChatUsers";
import { IoIosArrowBack } from "react-icons/io";
import { clearActiveRoom } from "@/store/slice/activeRoomSlice";
import { useMemo } from "react";
import AudioCall from "./AudioCall";
import VideoCall from "./VideoCall";

const ChatRoomNav = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const dispatch = useDispatch();
  const user = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);

  return (
    <main className="flex flex-row justify-between border-b lg:px-5 md:px-5 px-2 py-3">
      <section className="flex flex-row gap-x-2 items-center">
        <section className="lg:hidden md:hidden block">
          <IoIosArrowBack
            className="text-2xl"
            onClick={() => dispatch(clearActiveRoom())}
          />
        </section>
        {user && <UserImageAvatar user={user} size={10} />}
        <section className="flex flex-col">
          <section className="text-gray-700 dark:text-gray-300">
            {user?.displayName}
          </section>
          {user && <LastActive friend={user} />}
        </section>
      </section>
      <section className="flex flex-row gap-x-4 items-center justify-center">
        <AudioCall />
        <VideoCall />
        {user && <ChatRoomFriendInfo chatWith={user} />}
      </section>
    </main>
  );
};

export default ChatRoomNav;
