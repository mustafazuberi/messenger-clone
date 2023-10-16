import { RootState } from "@/store";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { ChatUsersSkeleton } from "./ChatUsers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChatRequest from "@/types/types.request";
import { useState } from "react";

type ActiveTab = "sentRequests" | "receivedRequests";
type RequestsNavProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

const Requests = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("receivedRequests");
  return (
    <main className="flex flex-col justify-between p-2 w-full gap-y-3">
      <RequestsNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "receivedRequests" && <ReceivedRequests />}
      {activeTab === "sentRequests" && <SentRequests />}
    </main>
  );
};

export default Requests;

const RequestsNav = ({ activeTab, setActiveTab }: RequestsNavProps) => {
  const handleActiveTabToggle = () => {
    if (activeTab === "receivedRequests") {
      setActiveTab("sentRequests");
    } else {
      setActiveTab("receivedRequests");
    }
  };
  return (
    <section className="flex flex-row justify-between items-center w-full mt-2">
      <section className="flex flex-row gap-x-2 items-center">
        <section>
          <Link href={"/"}>
            <BiArrowBack className="cursor-pointer text-2xl" />
          </Link>
        </section>
        <section>
          <h3 className="text-2xl font-bold">
            {activeTab === "receivedRequests" && "Requests"}
            {activeTab === "sentRequests" && "Sent Requests"}
          </h3>
        </section>
      </section>
      <section className="flex flex-row gap-x-2 items-center">
        <span
          className="text-[14px] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400"
          onClick={handleActiveTabToggle}
        >
          {activeTab === "sentRequests" && "Requests"}
          {activeTab === "receivedRequests" && "Sent Requests"}
        </span>
      </section>
    </section>
  );
};

const ReceivedRequests = () => {
  const receivedRequests = useSelector(
    (state: RootState) => state.chatRequests.receivedRequests
  );
  return (
    <section className="mt-3 flex flex-col gap-y-4">
      {receivedRequests.data?.length && receivedRequests.status === "idle" ? (
        receivedRequests.data?.map((req, i) => (
          <section className="flex flex-row justify-between px-1 " key={i}>
            <section className="flex flex-row gap-x-3">
              <section>
                <Image
                  src={req.sender.photoUrl || "https://github.com/shadcn.png"}
                  width={40}
                  height={40}
                  alt="user profile"
                  className="rounded-full"
                />
              </section>
              <section className="flex flex-col ">
                <h3>{req.sender.displayName}</h3>
                <h6 className="text-[12px]">{req.sender.email}</h6>
              </section>
            </section>
            <section>
              <Button variant={"outline"} className="w-[70px] h-8">
                Accept
              </Button>
            </section>
          </section>
        ))
      ) : false && receivedRequests.status === "loading" ? (
        <ChatUsersSkeleton />
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            You have no requests to accept.
          </h1>
        </section>
      )}
    </section>
  );
};

const SentRequests = () => {
  const sentRequests = useSelector(
    (state: RootState) => state.chatRequests.sentRequests
  );
  return (
    <section className="mt-3 flex flex-col gap-y-4">
      {sentRequests.data?.length && sentRequests.status === "idle" ? (
        sentRequests.data?.map((req, i) => (
          <section className="flex flex-row justify-between px-1 " key={i}>
            <section className="flex flex-row gap-x-3">
              <section>
                <Image
                  src={req.sender.photoUrl || "https://github.com/shadcn.png"}
                  width={40}
                  height={40}
                  alt="user profile"
                  className="rounded-full"
                />
              </section>
              <section className="flex flex-col ">
                <h3>{req.sender.displayName}</h3>
                <h6 className="text-[12px]">{req.sender.email}</h6>
              </section>
            </section>
            <section>
              <Button variant={"outline"} className="w-[70px] h-8">
                Accept
              </Button>
            </section>
          </section>
        ))
      ) : false && sentRequests.status === "loading" ? (
        <ChatUsersSkeleton />
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            You haven't reached out to anyone with requests.
          </h1>
        </section>
      )}
    </section>
  );
};
