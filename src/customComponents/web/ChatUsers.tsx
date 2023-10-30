import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { useSelector } from "react-redux";
import Link from "next/link";
import React from "react";
import UsersSkeleton from "./UsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";
import useChat from "@/hooks/useChat";
import Room from "@/types/types.room";
import Friend from "@/types/type.friend";
import { OnlineInfo } from "@/types/types.miscellaneous";
import Message from "@/types/types.message";

type props = {
  activeUsers: { [x: string]: OnlineInfo };
};

const ChatUsers = ({ activeUsers }: props) => {
  const friends = useSelector((state: RootState) => state.friends);
  const rooms = useSelector((state: RootState) => state.rooms);
  const { handleOnChatUser, getFriendFromRoomUsers } = useChat();

  return (
    <main className="flex flex-row justify-between p-2 items-center">
      <section className="flex flex-col gap-y-2 min-w-full overflow-y-auto">
        {rooms?.length ? (
          rooms?.map((room: Room) => {
            const friend: Friend | null = getFriendFromRoomUsers(room);
            if (!friend) return;
            return (
              <section
                className="flex flex-row justify-between border-b min-w-full cursor-pointer py-2 pr-2"
                key={room.id}
                onClick={() => handleOnChatUser(friend)}
              >
                <section className="flex flex-row gap-x-3 w-full">
                  <section>
                    <UserImageAvatar user={friend} size={10} />
                  </section>
                  <section className="flex flex-col w-full">
                    <section className="flex flex-row justify-between w-full">
                      <section>
                        <h3>{friend.displayName}</h3>
                      </section>
                      <section>
                        <LastActive friend={friend} activeUsers={activeUsers} />
                      </section>
                    </section>
                    <section>
                      {room.lastMessage ? (
                        <LastMessage message={room.lastMessage} />
                      ) : null}
                    </section>
                  </section>
                </section>
              </section>
            );
          })
        ) : friends.status === STATUSES.LOADING ? (
          <UsersSkeleton skeletonLength={7} />
        ) : (
          <NoFriendsToChat />
        )}
      </section>
    </main>
  );
};

export default ChatUsers;

const NoFriendsToChat = () => {
  return (
    <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
      <h1 className="text-[19px] font-light">
        You have no friends to chat with.
      </h1>
      <Link href={`?tab=findFriends`}>
        <span className="text-[17px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          <Button>Find Friends</Button>
        </span>
      </Link>
    </section>
  );
};

const LastMessage = ({ message }: { message: Message }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  return (
    <section>
      <p className="text-gray-500 text-[13px]">
        {message.text
          ? `${
              message.senderId === currentUser.uid ? "You: " : ""
            } ${message?.text.slice(0, 40)} ${
              message?.text.length > 40 ? "..." : ""
            }`
          : ""}
      </p>
    </section>
  );
};

const LastActive = ({
  friend,
  activeUsers,
}: {
  friend: Friend;
  activeUsers: { [x: string]: OnlineInfo };
}) => {
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
          <span className="text-gray-600 text-[12px]">
            Active {getTimeDifference(activeUsers[friend.uid]?.lastActive)}
          </span>
        </section>
      )}
    </section>
  );
};

const Friend = () => {};
