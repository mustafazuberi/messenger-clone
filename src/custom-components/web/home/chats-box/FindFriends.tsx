import { Input } from "@/components/ui/input";
import { RootState } from "@/store";
import Link from "next/link";
import { useSelector } from "react-redux";

const FindFriends = () => {
  const allUsers = useSelector((state: RootState) => state.allUsers);
  const findFriendsUsers = [];

  return (
    <main className="p-2">
      <FindFriendsNav />
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
        <Input placeholder="Search Friends..." type="search" />
      </section>
    </main>
  );
};
