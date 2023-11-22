"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { FaUserFriends } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";

type props = {
  searchMessengerInput: string;
  setSearchMessengerInput: (val: string) => void;
};

const ChatsBoxNav: React.FC<props> = ({
  searchMessengerInput,
  setSearchMessengerInput,
}) => {
  const router = useRouter();
  return (
    <main className="flex flex-col justify-between p-2 w-full gap-y-3">
      <section className="flex flex-row justify-between items-center w-full">
        <section>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Chats
          </h3>
        </section>
        <section className="flex flex-row gap-x-2 items-center">
          <span
            className="text-[12px] bg-clip-text text-transparent cursor-pointer bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400"
            onClick={() => router.push("/messages/?tab=findFriends")}
          >
            Find Friends
          </span>
          <Link
            href={`/messages/?tab=calls`}
            className="p-2 text-2xl border rounded-full hover:opacity-60"
          >
            <IoMdCall className="text-2xl" />
          </Link>
          <Link
            href={`/messages/?tab=requests`}
            className="p-2 text-2xl border rounded-full hover:opacity-60"
          >
            <FaUserFriends className="text-gray-700 dark:text-gray-300" />
          </Link>
        </section>
      </section>
      <section>
        <Input
          placeholder="Search Messenger..."
          value={searchMessengerInput}
          onChange={(e) => setSearchMessengerInput(e.target.value)}
        />
      </section>
    </main>
  );
};

export default ChatsBoxNav;
