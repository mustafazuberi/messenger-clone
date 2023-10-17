"use client";

import { useEffect } from "react";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";
import ChatUsers from "./ChatUsers";
import useHome from "@/hooks/useHome";
import { useSearchParams } from "next/navigation";
import Requests from "./Requests";
import useReq from "@/hooks/useReq";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ChatsBox = () => {
  const params = useSearchParams();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const friends = useSelector((state: RootState) => state.friends.data);
  const allUsers = useSelector((state: RootState) => state.allUsers.data);
  const { getAllUsers, getMyFriends, handleAuthStateChange, getStrangerUsers } =
    useHome();
  const {
    getChatRequests,
    getSentRequests,
    getReceivedRequests,
    getFriendsAndReqAgain,
  } = useReq();

  useEffect(() => {
    if (!currentUser.uid) return;
    handleAuthStateChange();
    getAllUsers();
  }, [currentUser.uid]);

  useEffect(() => {
    getMyFriends();
    getChatRequests(); // This will fetch whole collection including sent and received Reqs
    getSentRequests(); // fetch sent reqs
    getReceivedRequests(); // fetch received reqs
  }, [currentUser.uid, getFriendsAndReqAgain]);

  useEffect(() => {
    if (!currentUser.uid) return;
    getStrangerUsers();
  }, [currentUser.uid, friends, allUsers]);

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
