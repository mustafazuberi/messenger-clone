import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { FriendsState, UsersState } from "@/types/types.state";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const ChatUsers = () => {
  const friends: FriendsState = useSelector(
    (state: RootState) => state.friends
  );
  return (
    <main className="flex flex-row justify-between p-2 items-center mt-2">
      <section className="flex flex-col gap-y-2 min-w-full overflow-y-auto">
        {friends?.data?.length
          ? friends.data?.map((friend) => (
              <section
                className="flex flex-row justify-between border-b min-w-full cursor-pointer py-1 pr-2"
                key={friend.uid}
              >
                <section className="flex flex-row gap-x-3">
                  <section>
                    <Image
                      src={friend.photoUrl || "https://github.com/shadcn.png"}
                      width={40}
                      height={40}
                      alt="user profile"
                      className="rounded-full"
                    />
                  </section>
                  <section className="flex flex-col ">
                    <h3>{friend.displayName}</h3>
                    <h6 className="text-[12px]">{friend.email}</h6>
                  </section>
                </section>
                <section className="w-4 h-4 rounded-full bg-green-600"></section>
                {/* <section className="w-4 h-4 rounded-full bg-gray-600"></section> */}
              </section>
            ))
          : (friends.status === STATUSES.LOADING && <ChatUsersSkeleton />) || (
              <NoFriendsToChat />
            )}
      </section>
    </main>
  );
};

export default ChatUsers;

export const ChatUsersSkeleton = () => {
  return (
    <main className="flex flex-col gap-y-8">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[240px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[240px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[240px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[240px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[240px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </main>
  );
};

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
