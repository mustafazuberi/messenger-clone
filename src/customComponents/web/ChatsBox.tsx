"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";
import ChatUsers from "./ChatUsers";
import Requests from "./Requests";
import useHome from "@/hooks/useHome";
import useReq from "@/hooks/useReq";
import { RootState } from "@/store";

const ChatsBox = () => {
  const params = useSearchParams();
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const { getAllUsers, getMyFriends, handleAuthStateChange } = useHome();
  const { getChatRequests, getSentRequests, getReceivedRequests } = useReq();

  useEffect(() => {
    if (currentUser.uid) {
      handleAuthStateChange();
      getAllUsers();
      getMyFriends();
      getChatRequests();
      getSentRequests();
      getReceivedRequests();
    }
  }, [currentUser.uid]);

  const isFindFriendsTab = params.get("tab") === "findFriends";
  const isRequestsTab = params.get("tab") === "requests";

  return (
    <main className="sm:w-[350px] w-full border-r min-h-[90vh]">
      {isFindFriendsTab ? (
        <FindFriends />
      ) : isRequestsTab ? (
        <Requests />
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
