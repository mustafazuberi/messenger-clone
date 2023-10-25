import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import Friend from "@/types/type.friend";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const useChat = () => {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const [message, setMessage] = useState<string>("");

  const createChatRoom = async (users: {
    [x: string]: boolean;
  }): Promise<string> => {
    const room = await addDoc(collection(db, "chatrooms"), {
      users,
      createdAt: Date.now(),
    });
    return room.id;
  };

  const checkChatRoomAndGetRoomId = async (
    friendId: string
  ): Promise<string | null> => {
    try {
      const users = { [friendId]: true, [currentUser.uid]: true };
      const q = query(
        collection(db, "chatrooms"),
        where(`users.${friendId}`, "==", true),
        where(`users.${currentUser.uid}`, "==", true)
      );
      let roomId;

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        roomId = doc.id;
      });

      if (!roomId) return createChatRoom(users); // createChatRoom will create room of users param and return id of that room
      return roomId;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const handleOnChat = async (friend: Friend) => {
    const roomId = await checkChatRoomAndGetRoomId(friend.uid);
    if (!roomId) return;

    router.push(`messages/?chatroom=${roomId}`);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("send message function run!");
  };

  return {
    createChatRoom,
    sendMessage,
    message,
    setMessage,
    handleOnChat,
  };
};

export default useChat;
