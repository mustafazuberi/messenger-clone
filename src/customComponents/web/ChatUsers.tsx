import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { FriendsState } from "@/types/types.state";
import { useSelector } from "react-redux";
import Link from "next/link";
import React from "react";
import UsersSkeleton from "./UsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";
import useChat from "@/hooks/useChat";
import Room from "@/types/types.room";
import Friend from "@/types/type.friend";
import User from "@/types/types.user";

const ChatUsers = () => {
  const { handleOnChatUser } = useChat();
  const friends: FriendsState = useSelector(
    (state: RootState) => state.friends
  );
  const rooms = useSelector((state: RootState) => state.rooms);

  const getFriendFromRoomUsers = (room: Room): Friend | null => {
    let chatUser: Friend | null = null;
    for (const friend of friends.data) {
      for (const uid in room.userDetails) {
        if (room.userDetails.hasOwnProperty(uid) && uid === friend.uid) {
          chatUser = friends.data.find((f: Friend) => f.uid === uid) || null;
          break;
        }
      }
      if (chatUser) {
        break;
      }
    }
    if (!chatUser) return null;
    return chatUser;
  };
  return (
    <main className="flex flex-row justify-between p-2 items-center mt-2">
      <section className="flex flex-col gap-y-2 min-w-full overflow-y-auto">
        {rooms?.length
          ? rooms?.map((room: Room) => {
              const friend: Friend | null = getFriendFromRoomUsers(room);
              if (!friend) return;
              return (
                <section
                  className="flex flex-row justify-between border-b min-w-full cursor-pointer py-1 pr-2"
                  key={room.id}
                  onClick={() => handleOnChatUser(friend)}
                >
                  <section className="flex flex-row gap-x-3 items-center">
                    <section>
                      <UserImageAvatar user={friend} />
                    </section>
                    <section className="flex flex-col ">
                      <h3>{friend.displayName}</h3>
                      <p className="text-gray-500 text-[13px]">
                        {room.lastMessage?.text?.slice(0, 35)}{" "}
                        {room.lastMessage?.text &&
                        room.lastMessage?.text.length > 35
                          ? "..."
                          : ""}
                      </p>
                    </section>
                  </section>
                  <section className="w-4 h-4 rounded-full bg-green-600"></section>
                  {/* <section className="w-4 h-4 rounded-full bg-gray-600"></section> */}
                </section>
              );
            })
          : (friends.status === STATUSES.LOADING && (
              <UsersSkeleton skeletonLength={7} />
            )) || <NoFriendsToChat />}
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
