import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { ActiveRoom, ActiveRoomMessages } from "@/store/slice/chatRoom";
import { setRooms } from "@/store/slice/roomSlice";
import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import Room from "@/types/types.room";
import { Status } from "@/types/types.state";
import { Unsubscribe } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
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
  const [messageInp, setMessageInp] = useState<string>("");
  const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);

  const [activeRoomMessages, setActiveRoomMessages] =
    useState<ActiveRoomMessages>({ data: [], status: STATUSES.LOADING });

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

  const getActiveRoomMessages = (chatRoomId: string): Unsubscribe => {
    const unsubscribe = onSnapshot(
      query(collection(db, "chatrooms", chatRoomId, "messages")),
      (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
          messages.push({ ...(doc.data() as Message) });
        });
        setActiveRoomMessages({ data: messages, status: STATUSES.IDLE });
      }
    );
    return unsubscribe;
  };

  const getActiveRoom = async (chatRoomId: string) => {
    let room: Room | null = null;
    const docRoom = await getDoc(doc(db, "chatrooms", chatRoomId));
    if (docRoom.exists()) {
      room = { id: docRoom.id, ...(docRoom.data() as Room) };
    }

    if (!room) return;

    // getting user to chat with
    let friendId: string | null = null;
    for (const key in room.users) {
      if (key !== currentUser.uid) {
        friendId = key;
        break;
      }
    }

    if (!friendId) return;
    let chatWith: Friend | null = null;
    const docFriend = await getDoc(
      doc(db, "users", currentUser.uid, "friends", friendId)
    );
    if (!docFriend.exists()) {
      chatWith = { ...(docFriend.data() as Friend) };
    }

    if (!chatWith) return;

    console.log({ roomDetails: room, chatWith: chatWith });
    setActiveRoom({ roomDetails: room, chatWith: chatWith });
  };

  const handleOnChatUser = (friend: Friend) => {
    const room: Room | undefined = rooms.find(
      (room: Room) => room.users[friend.uid] && room.users[currentUser.uid]
    );
    if (!room) return;
    router.push(`messages/?roomId=${room.id}`);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const msgRef = collection(
      db,
      "chatrooms",
      activeRoom?.roomDetails?.id!,
      "messages"
    );
    const message: Message = {
      date: Date.now(),
      seen: false,
      senderId: currentUser.uid,
      text: messageInp,
    };
    await addDoc(msgRef, message);
    setMessageInp("");
  };

  return {
    messageInp,
    setMessageInp,
    createChatRoom,
    getMyRooms,
    handleOnChatUser,
    sendMessage,
    activeRoom,
    activeRoomMessages,
    setActiveRoomMessages,
    getActiveRoomMessages,
    getActiveRoom,
  };
};

export default useChat;
