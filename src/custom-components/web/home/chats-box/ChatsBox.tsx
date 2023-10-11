import getAllUsers from "@/services/firebase-firestore/getAllUsers";
import User from "@/types/types.user";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";
import ChatUsers from "./ChatUsers";

const ChatsBox = async () => {
  const users: User[] = await getAllUsers();
  console.log(users);
  return (
    <main className="w-80 border-r min-h-[90vh]">
      <FindFriends users={users} />
      <ChatsBoxNav />
      <ChatUsers users={users} />
    </main>
  );
};

export default ChatsBox;
