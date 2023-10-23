"use client";
import { Input } from "@/components/ui/input";
import { FaUserFriends } from "react-icons/fa";
import ChatsNavDropDown from "./ChatsNavDropDown";
import useHome from "@/hooks/useHome";
import React from "react";
import Link from "next/link";

const ChatsBoxNav = () => {
  const { handleOnSearchMessenger } = useHome();
  return (
    <main className="flex flex-col justify-between p-2 py-4 w-full gap-y-3">
      <section className="flex flex-row justify-between items-center w-full">
        <section>
          <h3 className="text-2xl font-bold">Chats</h3>
        </section>
        <section className="flex flex-row gap-x-2 items-center">
          <Link href={`?tab=findFriends`}>
            <span className="text-[12px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
              Find Friends
            </span>
          </Link>
          <Link
            href={`/messages/?tab=requests`}
            className="p-2 text-2xl border rounded-full hover:opacity-60"
          >
            <FaUserFriends />
          </Link>
          <ChatsNavDropDown />
        </section>
      </section>
      <section>
        <Input
          type="search"
          placeholder="Search Messenger..."
          onChange={handleOnSearchMessenger}
        />
      </section>
    </main>
  );
};

export default ChatsBoxNav;
