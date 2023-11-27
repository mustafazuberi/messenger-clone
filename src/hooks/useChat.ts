import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { setRooms } from "@/store/slice/roomsSlice";
import Friend, { ChatUser } from "@/types/type.friend";
import Message from "@/types/types.message";
import Room, { Block } from "@/types/types.room";
import { Unsubscribe } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActiveRoom,
  setActiveRoom,
  setActiveRoomMessages,
  updateActiveRoomBlock,
} from "@/store/slice/activeRoomSlice";
import User from "@/types/types.user";
import { toast } from "@/components/ui/use-toast";

const useChat = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state: RootState) => state.friends);
  const rooms = useSelector((state: RootState) => state.rooms);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const sectionRefMessagesDiv = useRef<HTMLDivElement | null>(null);

  const [roomsUnseenMessages, setRoomsUnseenMessages] = useState<{
    [x: string]: Message[];
  }>({});
  const [blockingOper, setBlockingOper] = useState<boolean>(false);
  const [openUnblockModal, setOpenUnblockModal] = useState(false);
  const [searchMessengerInput, setSearchMessengerInput] = useState<string>("");
  const [findFriendsSearchInput, setFindFriendsSearchInput] =
    useState<string>("");

  const createChatRoom = useCallback(
    async ({
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
          lastConversation: Date.now(),
          lastMessage: null,
          users: users,
          createdAt: Date.now(),
          userDetails: userDetails,
          block: { isBlocked: false, blockedBy: {} },
        };
        await addDoc(collection(db, "chatrooms"), { ...room });
      } catch (error) {
        console.log("Error in createChatRoom", error);
      }
    },
    []
  );

  const getMyRooms = useCallback((): Unsubscribe => {
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
      }
    );
    return unsubscribe;
  }, []);

  const getActiveRoomBlockInfoRealTime = useCallback((roomId: string) => {
    const unsub = onSnapshot(doc(db, "chatrooms", roomId), (doc) => {
      if (doc.data()) {
        dispatch(updateActiveRoomBlock({ ...(doc.data()?.block as Block) }));
      }
    });
    return unsub;
  }, []);

  const getRoomMessages = useCallback(
    (roomId: string): Unsubscribe => {
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

          // Dispatching active room messages in redux
          dispatch(
            setActiveRoomMessages({
              data: { [roomId]: [...messages] },
              status: STATUSES.IDLE,
            })
          );
        }
      );
      return unsubscribe;
    },
    [dispatch, rooms, currentUser]
  );

  const getChatUsers = useCallback(
    (rooms: Room[]): ChatUser[] => {
      const chatUsers: (ChatUser | null)[] = rooms.map((room) => {
        for (const friend of friends.data) {
          for (const uid in room.userDetails) {
            if (room.userDetails.hasOwnProperty(uid) && friend.uid === uid) {
              const chatUser: ChatUser = { ...friend, fromRoom: room }; // Return the friend when a match is found
              return chatUser;
            }
          }
        }
        return null; // Return null if no matching friend is found for the room
      });
      return chatUsers.filter((cU): cU is ChatUser => cU !== null);
    },
    [friends.data, rooms]
  );

  const handleOnChatUser = useCallback(
    (friend: Friend) => {
      dispatch(clearActiveRoom());
      const room: Room | undefined = rooms.find(
        (room: Room) => room.users[friend.uid] && room.users[currentUser.uid]
      );
      if (!room) return;
      dispatch(
        setActiveRoom({
          roomDetails: { ...room },
          chatWith: { ...friend },
          messages: { status: STATUSES.LOADING, data: null },
        })
      );
      getRoomMessages(room.id!);
    },
    [dispatch]
  );

  const getRoomsUnseenMessages = useCallback(async () => {
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
  }, [rooms, currentUser]);

  // This will update message to seen when we opens any chatroom
  const updateMessagesOnSeen = useCallback(async () => {
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
  }, [activeRoom.roomDetails?.id]);

  const scrollSectionToBottom = useCallback(() => {
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
  }, [sectionRefMessagesDiv.current]);

  const getTimeDifference = useCallback((milliSeconds: number): string => {
    const timeDifferenceMs = Date.now() - milliSeconds;
    const seconds = Math.floor(timeDifferenceMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} yr`;
    } else if (days > 0) {
      return `${days} d`;
    } else if (hours > 0) {
      return `${hours} h`;
    } else if (minutes > 0) {
      return `${minutes} m`;
    } else if (seconds > 1) {
      return `${seconds} s`;
    } else {
      return "1 second";
    }
  }, []);

  const handleOnBlock = useCallback(async () => {
    try {
      setBlockingOper(true);
      const roomRef = doc(db, "chatrooms", activeRoom.roomDetails?.id!);
      const block: Block = {
        blockedBy: {
          ...activeRoom.roomDetails?.block?.blockedBy,
          [currentUser.uid!]: currentUser,
        },
        isBlocked: true,
      };
      await updateDoc(roomRef, { block: block });
      toast({
        description: `You have blocked ${activeRoom.chatWith?.displayName}!`,
      });
      setBlockingOper(false);
    } catch (error) {
      setBlockingOper(false);
      console.log(error);
    }
  }, [setBlockingOper, activeRoom.roomDetails, currentUser]);

  const handleOnUnblock = useCallback(async () => {
    try {
      setBlockingOper(true);
      let block: Block = { ...activeRoom.roomDetails?.block! };

      const updatedBlock: Block = {
        blockedBy: { ...block.blockedBy, [currentUser.uid]: null },
        isBlocked: block.blockedBy[activeRoom.chatWith!?.uid] ? true : false,
      };

      const roomRef = doc(db, "chatrooms", activeRoom.roomDetails?.id!);
      await updateDoc(roomRef, { block: updatedBlock });
      toast({
        description: `You have unblocked ${activeRoom.chatWith?.displayName}!`,
      });
      setBlockingOper(false);
    } catch (error) {
      setBlockingOper(false);
      console.log(error);
    }
  }, [setBlockingOper, activeRoom.roomDetails, currentUser]);

  return {
    createChatRoom,
    getMyRooms,
    handleOnChatUser,
    getChatUsers,
    scrollSectionToBottom,
    sectionRefMessagesDiv,
    getTimeDifference,
    getRoomsUnseenMessages,
    roomsUnseenMessages,
    updateMessagesOnSeen,
    handleOnBlock,
    blockingOper,
    handleOnUnblock,
    openUnblockModal,
    setOpenUnblockModal,
    getActiveRoomBlockInfoRealTime,
    searchMessengerInput,
    setSearchMessengerInput,
    findFriendsSearchInput,
    setFindFriendsSearchInput,
  };
};

export default useChat;
