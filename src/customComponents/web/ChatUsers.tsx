import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { FriendsState } from "@/types/types.state";
import { useSelector } from "react-redux";
import Link from "next/link";
import React from "react";
import UsersSkeleton from "./UsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";

const ChatUsers = () => {
  const friends: FriendsState = useSelector(
    (state: RootState) => state.friends
  );
  return (
    <main className="flex flex-row justify-between p-2 items-center mt-2">
      <section className="flex flex-col gap-y-2 min-w-full overflow-y-auto">
        {friends?.data?.length
          ? friends.data?.map((friend) => (
              <Link href={`/messages/?chatroom=${friend.uid}`} key={friend.uid}>
                <section className="flex flex-row justify-between border-b min-w-full cursor-pointer py-1 pr-2">
                  <section className="flex flex-row gap-x-3 items-center">
                    <section>
                      <UserImageAvatar user={friend} />
                    </section>
                    <section className="flex flex-col ">
                      <h3>{friend.displayName}</h3>
                      <h6 className="text-[12px]">{friend.email}</h6>
                    </section>
                  </section>
                  <section className="w-4 h-4 rounded-full bg-green-600"></section>
                  {/* <section className="w-4 h-4 rounded-full bg-gray-600"></section> */}
                </section>
              </Link>
            ))
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
