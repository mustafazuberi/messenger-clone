import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { ActiveRoomMessages } from "@/types/chatRoom";
import { setRooms } from "@/store/slice/roomsSlice";
import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import Room from "@/types/types.room";
import { Unsubscribe } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveRoom } from "@/store/slice/activeRoomSlice";
import User from "@/types/types.user";

const useChat = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.friends);
  const rooms = useSelector((state: RootState) => state.rooms);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const sectionRefMessagesDiv = useRef<HTMLDivElement | null>(null);

  const [activeRoomMessages, setActiveRoomMessages] =
    useState<ActiveRoomMessages>({ data: [], status: STATUSES.LOADING });
  const [roomsUnseenMessages, setRoomsUnseenMessages] = useState<{
    [x: string]: Message[];
  }>({});

  const createChatRoom = async ({
    sender,
    reciever,
  }: {
    sender: User;
    reciever: User;
  }): Promise<void> => {
    try {
      const users = {
        [sender.uid]: true,
        [reciever.uid]: true,
      };
      const userDetails: { [x: string]: User } = {
        [sender.uid]: sender,
        [reciever.uid]: reciever,
      };
      const room: Room = {
        lastConversation: null,
        lastMessage: null,
        users: users,
        createdAt: Date.now(),
        userDetails: userDetails,
      };
      await addDoc(collection(db, "chatrooms"), { ...room });
    } catch (error) {
      console.log("Error in createChatRoom", error);
    }
  };

  const getMyRooms = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      query(
        query(
          collection(db, "chatrooms"),
          where(`users.${currentUser.uid}`, "==", true)
        )
      ),
      (querySnapshot) => {
        const rooms: Room[] = [];
        querySnapshot.forEach((doc) => {
          rooms.push({ id: doc.id, ...doc.data() } as Room);
        });
        const filteredRooms = rooms.sort(
          (a: Room, b: Room) => b.lastConversation! - a.lastConversation!
        );
        dispatch(setRooms([...filteredRooms]));

        // also updating active room in state if it is updated ---
        const updatedActiveRoom = filteredRooms.find(
          (room) => room.id === activeRoom.roomDetails?.id
        );
        if (updatedActiveRoom) {
          dispatch(
            setActiveRoom({
              ...activeRoom,
              roomDetails: { ...updatedActiveRoom },
            })
          );
        }
      }
    );
    return unsubscribe;
  };

  const getActiveRoomMessages = (): Unsubscribe => {
    const roomId = activeRoom.roomDetails?.id!;
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chatrooms", roomId, "messages"),
        orderBy("date", "asc")
      ),
      (querySnapshot) => {
        const messages: Message[] = [];
        querySnapshot.forEach((doc) => {
          messages.push({ ...(doc.data() as Message), id: doc.id });
        });
        setActiveRoomMessages({ data: messages, status: STATUSES.IDLE });
      }
    );
    return unsubscribe;
  };

  const getFriendFromRoomUsers = (room: Room): Friend | null => {
    let chatUser: Friend | null = null;
    for (const friend of friends.data) {
      for (const uid in room.userDetails) {
        if (room.userDetails.hasOwnProperty(uid) && friend.uid === uid) {
          chatUser = friend;
          break;
        }
      }
      if (chatUser) {
        break;
      }
    }
    return chatUser;
  };

  const handleOnChatUser = (friend: Friend) => {
    const room: Room | undefined = rooms.find(
      (room: Room) => room.users[friend.uid] && room.users[currentUser.uid]
    );
    if (!room) return;
    dispatch(
      setActiveRoom({ roomDetails: { ...room }, chatWith: { ...friend } })
    );
  };

  const getRoomsUnseenMessages = async () => {
    rooms.forEach((room: Room) => {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "chatrooms", room?.id!, "messages"),
          where("seen", "==", false)
        ),
        (querySnapshot) => {
          const messages: Message[] = [];
          querySnapshot.forEach((doc) => {
            if (doc.data().senderId !== currentUser.uid) {
              messages.push({ ...(doc.data() as Message) });
            }
          });
          setRoomsUnseenMessages((prev) => ({
            ...prev,
            [room.id!]: messages,
          }));
        }
      );
      return unsubscribe;
    });
  };

  // This will update message to seen when we opens any chatroom
  const updateActiveRoomUnseenMessagesToSeen = async () => {
    if (!activeRoom.roomDetails?.id) return;
    const roomId = activeRoom.roomDetails?.id;
    const messagesCollectionRef = collection(
      db,
      "chatrooms",
      roomId,
      "messages"
    );
    try {
      const querySnapshotMessages = await getDocs(messagesCollectionRef);
      const unseenMessagesBatch = writeBatch(db);
      querySnapshotMessages.forEach((doc) => {
        if (doc.data().senderId !== currentUser.uid) {
          const docRef = doc.ref;
          unseenMessagesBatch.update(docRef, {
            seen: true,
          });
        }
      });
      await unseenMessagesBatch.commit();
    } catch (err) {
      console.log(err, "Error while updating unseen messages to seen");
    }
  };

  const scrollSectionToBottom = () => {
    if (sectionRefMessagesDiv.current) {
      const element = sectionRefMessagesDiv.current as HTMLDivElement;
      const start = element.scrollTop;
      const end = element.scrollHeight;
      const duration = 100; // 0.5 seconds

      let startTime: number | null = null;

      const scroll = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        // Calculate the new scrollTop position
        element.scrollTop = easeInOut(elapsed, start, end - start, duration);

        // Continue scrolling if the duration hasn't passed
        if (elapsed < duration) {
          requestAnimationFrame(scroll);
        } else {
          startTime = null;
        }
      };

      const easeInOut = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(scroll);
    }
  };

  const getTimeDifference = (milliSeconds: number): string => {
    const timeDifferenceMs = Date.now() - milliSeconds;
    const seconds = Math.floor(timeDifferenceMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years === 1 ? "" : "s"}`;
    } else if (days > 0) {
      return `${days} day${days === 1 ? "" : "s"}`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? "" : "s"}`;
    } else if (seconds > 1) {
      return `${seconds} second${seconds === 1 ? "" : "s"}`;
    } else {
      return "1 second";
    }
  };

  return {
    createChatRoom,
    getMyRooms,
    handleOnChatUser,
    activeRoomMessages,
    getActiveRoomMessages,
    getFriendFromRoomUsers,
    scrollSectionToBottom,
    sectionRefMessagesDiv,
    getTimeDifference,
    getRoomsUnseenMessages,
    roomsUnseenMessages,
    updateActiveRoomUnseenMessagesToSeen,
  };
};

export default useChat;
