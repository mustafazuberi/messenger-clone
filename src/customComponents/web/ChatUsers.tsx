import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { useSelector } from "react-redux";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import useChat from "@/hooks/useChat";
import Friend, { ChatUser } from "@/types/type.friend";
import { MdInsertPhoto } from "react-icons/md";
import Message from "@/types/types.message";
import { FaUserFriends } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { useTheme } from "next-themes";
import UserImageAvatar from "./UserImageAvatar";
import { ChatUserProps } from "@/types/types.miscellaneous";

type props = {
  searchMessengerInput: string;
};

const ChatUsers: React.FC<props> = ({ searchMessengerInput }) => {
  const friends = useSelector((state: RootState) => state.friends);
  const rooms = useSelector((state: RootState) => state.rooms);
  const {
    getChatUsers,
    getRoomsUnseenMessages,
    roomsUnseenMessages,
  } = useChat();
  const chatUsers: ChatUser[] = useMemo(() => getChatUsers(rooms), [rooms]);

  useEffect(() => {
    if (rooms.length) getRoomsUnseenMessages();
  }, [rooms.length]);

  const [filteredChatUsers, setFilteredChatUsers] = useState<ChatUser[]>([]);
  useEffect(() => {
    const filtered = chatUsers.filter((chatUser: ChatUser) =>
      chatUser.displayName
        .toLowerCase()
        .includes(searchMessengerInput.toLowerCase())
    );
    setFilteredChatUsers(filtered);
  }, [searchMessengerInput, chatUsers]);

  return (
    <section className="min-w-full flex flex-col items-center flex-1 max-h-full overflow-y-auto scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-w-3 scrollbar-track-inherit">
      {filteredChatUsers?.length && friends.status === STATUSES.IDLE ? (
        filteredChatUsers?.map((chatUser: ChatUser) => {
          return (
            <section key={chatUser.uid} className="min-w-full">
              <ChatUser
                friend={chatUser}
                room={chatUser.fromRoom}
                roomsUnseenMessages={roomsUnseenMessages}
              />
            </section>
          );
        })
      ) : (
        <NoFriendsToChat />
      )}
    </section>
  );
};

export default ChatUsers;

const NoFriendsToChat = React.memo(() => {
  const friends = useSelector((state: RootState) => state.friends);
  return (
    <section>
      {friends.data.length ? (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[25px] font-bold">No chats found.</h1>
        </section>
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            You have no friends to chat with.
          </h1>
          <Link prefetch href={`?tab=findFriends`}>
            <span className="text-[17px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
              <Button>Find Friends</Button>
            </span>
          </Link>
        </section>
      )}
    </section>
  );
});

const LastMessage: React.FC<{ message: Message }> = React.memo(
  ({ message }) => {
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const msgByMe = message.senderId === currentUser.uid;
    const messageText = msgByMe ? `You: ${message.text}` : message.text;

    return (
      <section>
        <div className="text-gray-500 text-[13px]">
          {message.text &&
            messageText &&
            `${messageText.slice(0, 40)}${
              messageText.length > 40 ? "..." : ""
            }`}
          {message.img && (
            <div className="flex flex-row gap-x-1 items-center">
              Photo <MdInsertPhoto className="text-[17px]" />
            </div>
          )}
          {message.friend && (
            <div className="flex flex-row gap-x-1 items-center">
              {msgByMe ? "You: " : ""} Shared a Friend
              <FaUserFriends className="text-[17px]" />
            </div>
          )}
          {message.voice && (
            <div className="flex flex-row gap-x-1 items-center">
              {msgByMe ? "You: " : ""} Audio
              <AiFillAudio className="text-[17px]" />
            </div>
          )}
        </div>
      </section>
    );
  }
);

export const LastActive: React.FC<{ friend: Friend }> = React.memo(
  ({ friend }) => {
    const activeUsers = useSelector((state: RootState) => state.activeUsers);
    const { getTimeDifference } = useChat();
    return (
      <section className="w-full">
        {activeUsers[friend.uid]?.isActive ? (
          <section className="flex flex-row gap-x-1">
            <span className="text-green-600 text-[12px]">Active</span>
            <section className="w-4 h-4 rounded-full bg-green-600"></section>
          </section>
        ) : (
          <section className="flex flex-row gap-x-1">
            <span className="text-gray-700 dark:text-gray-300 text-[12px] flex flex-row gap-x-1">
              <span className="lg:flex md:hidden hidden">Active</span>
              <span>
                {getTimeDifference(activeUsers[friend.uid]?.lastActive)} ago
              </span>
            </span>
          </section>
        )}
      </section>
    );
  }
);

const ChatUser: React.FC<ChatUserProps> = ({
  friend,
  room,
  roomsUnseenMessages,
}) => {
  const { handleOnChatUser } = useChat();
  const { theme } = useTheme();
  const hover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-300";
  return (
    <section
      className={`flex flex-row justify-between border-b min-w-full cursor-pointer p-2 py-4 ${hover}`}
      onClick={() => handleOnChatUser(friend)}
    >
      <section className="flex flex-row gap-x-3 w-full items-center">
        <section>
          <UserImageAvatar user={friend} size={10} />
        </section>
        <section className="flex flex-col w-full">
          <section className="flex flex-row justify-between w-full">
            <section>
              <h3 className="text-gray-700 dark:text-gray-300">
                {friend.displayName}
              </h3>
            </section>
            <section>
              <LastActive friend={friend} />
            </section>
          </section>
          <section>
            {room.lastMessage && !roomsUnseenMessages[room.id!]?.length ? (
              <LastMessage message={room.lastMessage} />
            ) : roomsUnseenMessages[room.id!]?.length ? (
              <section className="flex flex-row gap-x-1 items-center">
                <span className="w-2 h-2 rounded-full bg-blue-700" />
                <p className="text-gray-700 font-extrabold text-[13px]">
                  {`${roomsUnseenMessages[room.id!]?.length} new message${
                    roomsUnseenMessages[room.id!]?.length > 1 ? "s." : "."
                  }`}
                </p>
              </section>
            ) : null}
          </section>
        </section>
      </section>
    </section>
  );
};
