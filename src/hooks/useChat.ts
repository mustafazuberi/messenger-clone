import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { setRoomsMessages } from "@/store/slice/roomMessages";
import { setRooms } from "@/store/slice/roomSlice";
import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import Room from "@/types/types.room";
import { RoomsMessages } from "@/types/types.state";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useChat = () => {
  const router = useRouter();
  const rooms = useSelector((state: RootState) => state.rooms);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const [message, setMessage] = useState<string>("");

  const createChatRoom = async (users: {
    [x: string]: boolean;
  }): Promise<void> => {
    const room: Room = {
      lastConversation: null,
      lastMessage: null,
      users: users,
      createdAt: Date.now(),
    };
    await addDoc(collection(db, "chatrooms"), { ...room });
  };

  const getMyRooms = async () => {
    const q = query(
      collection(db, "chatrooms"),
      where(`users.${currentUser.uid}`, "==", true)
    );
    const querySnapshot = await getDocs(q);
    const rooms: Room[] = [];
    querySnapshot.forEach((doc) => {
      rooms.push({ id: doc.id, ...doc.data() } as Room);
    });
    dispatch(setRooms([...rooms]));
  };

  const handleOnChatUser = (friend: Friend) => {
    const room: Room | undefined = rooms.find(
      (room: Room) => room.users[friend.uid] && room.users[currentUser.uid]
    );
    if (!room) return;
    router.push(`messages/?roomId=${room.id}`);
  };

  const getRoomsMessages = () => {
    const roomIds: string[] = rooms.map((room: Room) => room.id!);
    if (!roomIds.length) return;

    roomIds.forEach((roomId) => {
      const roomsMessages: RoomsMessages = {};
      const messagesRef = collection(db, "chatrooms", roomId, "messages");
      const unsubscribe = onSnapshot(messagesRef, (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((msg) => {
          messages.push({ id: msg.id, ...(msg.data() as Message) });
        });
        roomsMessages[roomId] = messages;
      });
      dispatch(setRoomsMessages(roomsMessages));
      return unsubscribe;
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("send message function run!");
  };

  return {
    message,
    setMessage,
    createChatRoom,
    getMyRooms,
    handleOnChatUser,
    getRoomsMessages,
    sendMessage,
  };
};

export default useChat;
