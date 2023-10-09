import ChatsNavDropDown from "./ChatsNavDropDown";

const ChatsBoxNav = () => {
  return (
    <main className="flex flex-row justify-between p-2 items-center w-full">
      <section>
        <h3 className="text-2xl font-bold">Chats</h3>
      </section>
      <section>
        <ChatsNavDropDown />
      </section>
    </main>
  );
};

export default ChatsBoxNav;
