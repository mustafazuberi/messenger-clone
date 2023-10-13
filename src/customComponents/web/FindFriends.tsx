import { Input } from "@/components/ui/input";
import useFindFriends from "@/hooks/useFindFriends";
import Image from "next/image";
import Link from "next/link";
import { ChatUsersSkeleton } from "./ChatUsers";

const FindFriends = () => {
  const { strangers } = useFindFriends();
  console.log(strangers);
  return (
    <main className="p-2">
      <FindFriendsNav />
      <section className="mt-4">
        {strangers.length ? (
          strangers?.map((u) => (
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
                <button className="text-white py-1 px-2 bg-purple-600 rounded-2xl text-[12px]">
                  Add
                </button>
              </section>
            </section>
          ))
        ) : (
          <ChatUsersSkeleton />
        )}
      </section>
    </main>
  );
};

export default FindFriends;

const FindFriendsNav = () => {
  return (
    <main className="flex flex-col gap-y-3 mt-2">
      <section className="flex flex-row justify-between items-center w-full">
        <section>
          <h3 className="text-2xl font-bold">Find Friends</h3>
        </section>
        <section className="flex flex-row gap-x-2 items-center">
          <Link href={`/`}>
            <span className="text-[12px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
              Chats
            </span>
          </Link>
        </section>
      </section>
      <section>
        <Input placeholder="Find Friends..." type="search" />
      </section>
    </main>
  );
};
