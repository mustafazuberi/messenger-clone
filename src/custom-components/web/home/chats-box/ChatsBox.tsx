import getAllUsers from "@/services/firebase-firestore/getAllUsers";
import User from "@/types/types.user";
import ChatsBoxNav from "./ChatsBoxNav";
import FindFriends from "./FindFriends";

const ChatsBox = async () => {
  const users: User[] = await getAllUsers();
  return (
    <main className="w-80 border-r min-h-[90vh]">
      <FindFriends users={users} />
      <ChatsBoxNav />
    </main>
  );
};

export default ChatsBox;
