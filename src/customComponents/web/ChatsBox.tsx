"use client";

import { useEffect } from "react";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";
import ChatUsers from "./ChatUsers";
import useHome from "@/hooks/useHome";
import { useSearchParams } from "next/navigation";
import Requests from "./Requests";
import useReq from "@/hooks/useReq";

const ChatsBox = () => {
  const params = useSearchParams();
  const { getAllUsers, getMyFriends, handleAuthStateChange, getStrangerUsers } =
    useHome();
  const { getChatRequests, getSentRequests, getReceivedRequests } = useReq();

  useEffect(() => {
    handleAuthStateChange();
    getAllUsers();
    getMyFriends();
    getStrangerUsers();
    getChatRequests(); // This will fetch whole collection including sent and received Reqs
    getSentRequests(); // fetch sent reqs
    getReceivedRequests(); // fetch received reqs
  }, []);

  const findFriendsTab = params.get("tab") === "findFriends" ? true : false;
  const requestsTab = params.get("tab") === "requests" ? true : false;

  return (
    <main className="sm:w-[350px] w-full border-r min-h-[90vh]">
      {findFriendsTab ? (
        <FindFriends />
      ) : requestsTab ? (
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
