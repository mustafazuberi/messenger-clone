import { RootState } from "@/store";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { ChatUsersSkeleton } from "./ChatUsers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChatRequest from "@/types/types.request";

const Requests = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const chatRequests = useSelector((state: RootState) => state.chatRequests);
  const receivedReqs = chatRequests.data.filter(
    (req: ChatRequest) => req.receiverId === currentUser.uid
  );
  const sentReqs = chatRequests.data.filter(
    (req: ChatRequest) => req.senderId === currentUser.uid
  );

  return (
    <main className="flex flex-col justify-between p-2 w-full gap-y-3">
      <RequestsNav />
      <section className="mt-3 flex flex-col gap-y-4">
        {receivedReqs.length && chatRequests.status === "idle" ? (
          receivedReqs.map((req) => (
            <section
              className="flex flex-row justify-between px-1 "
              key={req.senderId}
            >
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
        ) : chatRequests.status === "loading" ? (
          <ChatUsersSkeleton />
        ) : (
          <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
            <h1 className="text-[19px] font-light">
              You have no requests to accept.
            </h1>
          </section>
        )}
      </section>
    </main>
  );
};

export default Requests;

const RequestsNav = () => {
  return (
    <section className="flex flex-row justify-between items-center w-full mt-2">
      <section className="flex flex-row gap-x-2 items-center">
        <section>
          <Link href={"/"}>
            <BiArrowBack className="cursor-pointer text-2xl" />
          </Link>
        </section>
        <section>
          <h3 className="text-2xl font-bold">Requests</h3>
        </section>
      </section>
      <section className="flex flex-row gap-x-2 items-center">
        <span className="text-[12px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          Sent Requests
        </span>
      </section>
    </section>
  );
};
