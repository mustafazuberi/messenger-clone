"use client";

import { useEffect } from "react";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";
import ChatUsers from "./ChatUsers";
import useHome from "@/hooks/useHome";
import { useSearchParams } from "next/navigation";

const ChatsBox = () => {
  const params = useSearchParams();
  const { getAllUsers, getMyFriends } = useHome();
  useEffect(() => {
    getAllUsers();
    getMyFriends();
  }, []);

  const findFriendsTab = params.get("tab") === "findFriends" ? true : false;

  return (
    <main className="w-80 border-r min-h-[90vh]">
      {findFriendsTab ? (
        <FindFriends />
      ) : (
        <section>
          <ChatsBoxNav />
          <ChatUsers />
        </section>
      )}
    </main>
  );
};

export default ChatsBox;
