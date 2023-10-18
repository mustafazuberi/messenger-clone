import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ChatUsersSkeleton } from "./ChatUsers";
import { useSelector } from "react-redux";
import { STATUSES } from "@/store/intialState";
import { ChatRequestsState } from "@/types/types.state";
import { RootState } from "@/store";
import { BiArrowBack } from "react-icons/bi";
import useReq from "@/hooks/useReq";
import { Button } from "@/components/ui/button";
import getUnknownUsers from "@/services/getUnknownUsers";
import { reqStatusObj } from "@/types/types.UnknownUser";
import { useCallback } from "react";

const FindFriends = () => {
  const { sendChatRequest, unsendChatRequest, confirmChatRequest } = useReq();

  const { receivedRequests, sentRequests }: ChatRequestsState = useSelector(
    (state: RootState) => state.chatRequests
  );

  const myFriends = useSelector((state: RootState) => state.friends.data);
  const allUsers = useSelector((state: RootState) => state.allUsers);
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const unknownUsersCallBack = useCallback(() => {
    return getUnknownUsers({
      allUsers: allUsers.data,
      friends: myFriends,
      receivedReqs: receivedRequests.data,
      sentReqs: sentRequests.data,
    });
  }, [sentRequests.data, receivedRequests.data, myFriends]);

  const unknownUsers = unknownUsersCallBack();

  return (
    <main className="p-2">
      <FindFriendsNav />
      <section className="mt-4">
        {allUsers.status === STATUSES.LOADING ? (
          <ChatUsersSkeleton />
        ) : unknownUsers.length ? (
          unknownUsers?.map((user) => {
            if (myFriends.find((friend) => friend.uid === user.uid)) return;
            return (
              <section
                className="flex flex-row justify-between border-b min-w-full py-2 pr-2"
                key={user.uid}
              >
                <section className="flex flex-row gap-x-3">
                  <section>
                    <Image
                      src={user.photoUrl || "https://github.com/shadcn.png"}
                      width={40}
                      height={40}
                      alt="user profile"
                      className="rounded-full"
                    />
                  </section>
                  <section className="flex flex-col">
                    <h3>{user.displayName}</h3>
                    <h6 className="text-[12px]">{user.email}</h6>
                  </section>
                </section>
                <section>
                  <Button
                    variant="outline"
                    className="px-3 h-8"
                    onClick={() =>
                      user.reqStatus === reqStatusObj.UNKNOWN
                        ? sendChatRequest({
                            sender: currentUser,
                            receiver: {
                              displayName: user.displayName,
                              email: user.email,
                              emailVerified: user.emailVerified,
                              uid: user.uid,
                              gender: user.gender,
                              photoUrl: user.photoUrl,
                            },
                          })
                        : user?.reqStatus?.status === reqStatusObj.ALREADY_SENT
                        ? unsendChatRequest(user.reqStatus.request)
                        : confirmChatRequest(user.reqStatus.request)
                    }
                  >
                    {user.reqStatus === reqStatusObj.UNKNOWN
                      ? "Add"
                      : user?.reqStatus?.status === reqStatusObj.ALREADY_SENT
                      ? "Unsent"
                      : user?.reqStatus?.status ===
                        reqStatusObj.ALREADY_RECIEVED
                      ? "Confirm"
                      : ""}
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
