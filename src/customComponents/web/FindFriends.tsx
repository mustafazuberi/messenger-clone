import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ChatUsersSkeleton } from "./ChatUsers";
import { useSelector } from "react-redux";
import { STATUSES } from "@/store/intialState";
import { StrangersState } from "@/types/types.state";
import { RootState } from "@/store";
import { BiArrowBack } from "react-icons/bi";
import useReq from "@/hooks/useReq";
import { Button } from "@/components/ui/button";

const FindFriends = () => {
  const { sendChatRequest } = useReq();
  const strangersState: StrangersState = useSelector(
    (state: RootState) => state.strangers
  );
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { emailVerified, ...currentUserAsStranger } = currentUser;

  console.log(strangersState);

  return (
    <main className="p-2">
      <FindFriendsNav />
      <section className="mt-4">
        {strangersState.data.length
          ? strangersState.data?.map((u) => (
              <section
                className="flex flex-row justify-between border-b min-w-full py-2 pr-2"
                key={u.uid}
              >
                <section className="flex flex-row gap-x-3">
                  <section>
                    <Image
                      src={u.photoUrl || "https://github.com/shadcn.png"}
                      width={40}
                      height={40}
                      alt="user profile"
                      className="rounded-full"
                    />
                  </section>
                  <section className="flex flex-col ">
                    <h3>{u.displayName}</h3>
                    <h6 className="text-[12px]">{u.email}</h6>
                  </section>
                </section>
                <section>
                  <Button
                    variant={"outline"}
                    className="w-[70px] h-8"
                    onClick={() =>
                      sendChatRequest({
                        sender: currentUserAsStranger,
                        receiver: u,
                      })
                    }
                  >
                    {u.StrangerStatus === "stranger"
                      ? "Add"
                      : u.StrangerStatus === "Req Received"
                      ? "Accept"
                      : "unsent"}
                  </Button>
                </section>
              </section>
            ))
          : (strangersState.status === STATUSES.LOADING && (
              <ChatUsersSkeleton />
            )) ||
            "No users are available on the website"}
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
