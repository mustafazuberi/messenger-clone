"use client";
import { Input } from "@/components/ui/input";
import ChatsNavDropDown from "./ChatsNavDropDown";
import useHome from "@/hooks/useHome";

const ChatsBoxNav = () => {
  const {handleOnSearchMessenger} = useHome();
  return (
    <main className="flex flex-col justify-between p-2 w-full gap-y-3">
      <section className="flex flex-row justify-between items-center w-full">
        <section>
          <h3 className="text-2xl font-bold">Chats</h3>
        </section>
        <section>
          <ChatsNavDropDown />
        </section>
      </section>
      <section>
        <Input type="search" placeholder="Search Messenger..." onChange={handleOnSearchMessenger} />
      </section>
    </main>
  );
};

export default ChatsBoxNav;
