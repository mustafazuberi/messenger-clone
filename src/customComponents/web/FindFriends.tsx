import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ChatUsersSkeleton } from "./ChatUsers";
import { useSelector } from "react-redux";
import { STATUSES } from "@/store/intialState";
import { ChatRequestsState, StrangersState } from "@/types/types.state";
import { RootState } from "@/store";
import { BiArrowBack } from "react-icons/bi";
import useReq from "@/hooks/useReq";
import { Button } from "@/components/ui/button";
import ChatRequest from "@/types/types.request";

const FindFriends = () => {
  const {
    sendChatRequest,
    unsendChatRequest,
    confirmChatRequest,
    confirmReqLoading,
  } = useReq();
  const strangersState: StrangersState = useSelector(
    (state: RootState) => state.strangers
  );
  console.log("strangersState", strangersState);
  const { receivedRequests, sentRequests }: ChatRequestsState = useSelector(
    (state: RootState) => state.chatRequests
  );
  //
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { emailVerified, ...currentUserAsStranger } = currentUser;

  return (
    <main className="p-2">
      <FindFriendsNav />
      <section className="mt-4">
        {strangersState.status === STATUSES.LOADING ? (
          <ChatUsersSkeleton />
        ) : strangersState.data.length ? (
          strangersState.data.map((strngU) => {
            const receivedRequest: ChatRequest | undefined =
              receivedRequests.data.find(
                (recR) => recR.senderId === strngU.uid
              );
            const sentRequest: ChatRequest | undefined = sentRequests.data.find(
              (sentR) => sentR.receiverId === strngU.uid
            );
            return (
              <section
                className="flex flex-row justify-between border-b min-w-full py-2 pr-2"
                key={strngU.uid}
              >
                <section className="flex flex-row gap-x-3">
                  <section>
                    <Image
                      src={strngU.photoUrl || "https://github.com/shadcn.png"}
                      width={40}
                      height={40}
                      alt="user profile"
                      className="rounded-full"
                    />
                  </section>
                  <section className="flex flex-col">
                    <h3>{strngU.displayName}</h3>
                    <h6 className="text-[12px]">{strngU.email}</h6>
                  </section>
                </section>
                <section>
                  <Button
                    variant="outline"
                    className="px-3 h-8"
                    onClick={() =>
                      sentRequest
                        ? unsendChatRequest(sentRequest)
                        : receivedRequest
                        ? confirmChatRequest(receivedRequest)
                        : sendChatRequest({
                            sender: currentUserAsStranger,
                            receiver: strngU,
                          })
                    }
                  >
                    {sentRequest
                      ? "Unsent"
                      : receivedRequest
                      ? confirmReqLoading
                        ? "Please wait..."
                        : "Confirm"
                      : "Add"}
                  </Button>
                </section>
              </section>
            );
          })
        ) : (
          <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
            <h1 className="text-[19px] font-light">
              No users are available on the website
            </h1>
          </section>
        )}
      </section>
    </main>
  );
};

export default FindFriends;

const FindFriendsNav = () => {
  return (
    <main className="flex flex-col gap-y-3 mt-2">
      <section className="flex flex-row gap-x-2 items-center w-full">
        <Link href={"/"}>
          <BiArrowBack className="cursor-pointer text-2xl" />
        </Link>
        <section>
          <h3 className="text-2xl font-bold">Find Friends</h3>
        </section>
      </section>
      <section>
        <Input placeholder="Find Friends..." type="search" />
      </section>
    </main>
  );
};
