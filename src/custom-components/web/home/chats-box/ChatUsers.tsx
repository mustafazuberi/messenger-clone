import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "@/store";
import User from "@/types/types.user";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

const ChatUsers = () => {
  const users = useSelector((state: RootState) => state.allUsers);
  return (
    <main className="flex flex-row justify-between p-2 items-center mt-2">
      <section className="flex flex-col gap-y-2 min-w-full overflow-y-auto">
        {users.length ? (
          users?.map((u) => (
            <section
              className="flex flex-row justify-between border-b min-w-full cursor-pointer py-1 pr-2"
              key={u.uid}
            >
              <section className="flex flex-row gap-x-3">
                <section>
                  <Image
                    src={u.photoUrl || "https://github.com/shadcn.png"}
                    width={40}
                    height={40}
                    alt="user profile"
                    className="rounded-full"
                  />
                </section>
                <section className="flex flex-col ">
                  <h3>{u.displayName}</h3>
                  <h6 className="text-[12px]">{u.email}</h6>
                </section>
              </section>
              <section className="w-4 h-4 rounded-full bg-green-600"></section>
              {/* <section className="w-4 h-4 rounded-full bg-gray-600"></section> */}
            </section>
          ))
        ) : (
          <ChatUsersSkeleton />
        )}
      </section>
    </main>
  );
};

export default ChatUsers;

const ChatUsersSkeleton = () => {
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
