import { RootState } from "@/store";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useReq from "@/hooks/useReq";
import UsersSkeleton from "./UsersSkeleton";
import ReceivedRequests from "./ReceivedRequests";
import UserImageAvatar from "./UserImageAvatar";

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

const SentRequests = () => {
  const sentRequests = useSelector(
    (state: RootState) => state.chatRequests.sentRequests
  );
  const { unsendChatRequest } = useReq();
  return (
    <section className="mt-3 flex flex-col gap-y-4">
      {sentRequests.data?.length && sentRequests.status === "idle" ? (
        sentRequests.data?.map((req, i) => (
          <section className="flex flex-row justify-between px-1 " key={i}>
            <section className="flex flex-row gap-x-3">
              <section>
                <UserImageAvatar user={req.receiver} />
              </section>
              <section className="flex flex-col ">
                <h3>{req.receiver.displayName}</h3>
                <h6 className="text-[12px]">{req.receiver.email}</h6>
              </section>
            </section>
            <section>
              <Button
                variant={"outline"}
                className="w-[70px] h-8"
                onClick={() => unsendChatRequest(req)}
              >
                Unsend
              </Button>
            </section>
          </section>
        ))
      ) : false && sentRequests.status === "loading" ? (
        <UsersSkeleton skeletonLength={7} />
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
