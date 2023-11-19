import React, { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { RootState } from "@/store";
import { ActiveTab } from "@/types/types.miscellaneous";
import { FindFriendsNav } from "./FindFriends";
import ChatsBoxNav from "./ChatsBoxNav";
import useHome from "@/hooks/useHome";
import useReq from "@/hooks/useReq";
import SuspenseSkeleton from "./SuspenseSkeleton";
import useChat from "@/hooks/useChat";
import useActive from "@/hooks/useActive";
import RequestsNav from "./RequestsNav";

const FindFriends = dynamic(() => import("./FindFriends"), {
  loading: () => <SuspenseSkeleton />,
});
const ChatUsers = dynamic(() => import("./ChatUsers"), {
  loading: () => <SuspenseSkeleton />,
});
const SentRequests = dynamic(() => import("./SentRequests"), {
  loading: () => <SuspenseSkeleton />,
});
const ReceivedRequests = dynamic(() => import("./ReceivedRequests"), {
  loading: () => <SuspenseSkeleton />,
});

const ChatsBox = () => {
  const params = useSearchParams();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { handleAuthStateChange, getAllUsers, getMyFriends } = useHome();
  const { getChatRequests, getSentRequests, getReceivedRequests } = useReq();
  const {
    getMyRooms,
    searchMessengerInput,
    setSearchMessengerInput,
    findFriendsSearchInput,
    setFindFriendsSearchInput,
  } = useChat();
  const { detectingConnectionState, handleOnDisconnectAndConnect } =
    useActive();

  const memoizedHandleAuthStateChange = useMemo(
    () => handleAuthStateChange,
    []
  );
  const memoizedGetAllUsers = useMemo(() => getAllUsers, []);
  const memoizedGetMyFriends = useMemo(() => getMyFriends, []);

  useEffect(() => {
    if (currentUser.uid) {
      memoizedHandleAuthStateChange();
      memoizedGetAllUsers();
      memoizedGetMyFriends();
      getChatRequests();
      getSentRequests();
      getReceivedRequests();
      getMyRooms();
    }
    detectingConnectionState();
    handleOnDisconnectAndConnect();
  }, [
    currentUser.uid,
    memoizedHandleAuthStateChange,
    memoizedGetAllUsers,
    memoizedGetMyFriends,
  ]);

  const isFindFriendsTab = params?.get("tab") === "findFriends";
  const isRequestsTab = params?.get("tab") === "requests";

  const [activeTab, setActiveTab] = useState<ActiveTab>("receivedRequests");

  return (
    <main className="min-h-full max-h-full min-w-full border-r">
      {isFindFriendsTab ? (
        <section className="flex flex-col min-w-full max-h-full min-h-full">
          <FindFriendsNav
            findFriendsSearchInput={findFriendsSearchInput}
            setFindFriendsSearchInput={setFindFriendsSearchInput}
          />
          <Suspense fallback={<SuspenseSkeleton />}>
            <FindFriends findFriendsSearchInput={findFriendsSearchInput} />
          </Suspense>
        </section>
      ) : isRequestsTab ? (
        <section className="flex flex-col min-w-full max-h-full min-h-full">
          <RequestsNav activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "receivedRequests" && (
            <Suspense fallback={<SuspenseSkeleton />}>
              <ReceivedRequests />
            </Suspense>
          )}
          {activeTab === "sentRequests" && (
            <Suspense fallback={<SuspenseSkeleton />}>
              <SentRequests />
            </Suspense>
          )}
        </section>
      ) : (
        <section className="flex flex-col min-w-full max-h-full min-h-full">
          <ChatsBoxNav
            searchMessengerInput={searchMessengerInput}
            setSearchMessengerInput={setSearchMessengerInput}
          />
          <Suspense fallback={<SuspenseSkeleton />}>
            <ChatUsers searchMessengerInput={searchMessengerInput} />
          </Suspense>
        </section>
      )}
    </main>
  );
};

export default ChatsBox;
