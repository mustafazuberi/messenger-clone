import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { setNotifications } from "@/store/slice/notificationsSlice";
import { SendNotificationParam } from "@/types/types.miscellaneous";
import UserNotification from "@/types/types.notification";
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Friend from "@/types/type.friend";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import useChat from "./useChat";

const useNotification = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const notifications = useSelector((state: RootState) => state.notifications);
  const friends = useSelector((state: RootState) => state.friends);
  const { handleOnChatUser } = useChat();

  let unReadNotifications = notifications.data.filter(
    (notf: UserNotification) => !notf.isNotificationRead
  );

  const sendNotification = useCallback(
    async ({ by, to, type, requestId }: SendNotificationParam) => {
      if (!by || !to || !type) return;
      try {
        let message: string = "";
        if (type === "Request Received")
          message = `${by.displayName} has sent you a friend request.`;
        if (type === "Request Accepted")
          message = `${by.displayName} has accepted your friend request.`;

        const notificationObj: UserNotification = {
          isNotificationRead: false,
          isRequestRead: false,
          timestamp: Date.now(),
          type: type,
          by: by.uid,
          to: to.uid,
          requestId,
          message,
        };
        await addDoc(collection(db, "notifications"), {
          ...notificationObj,
        });
      } catch (error) {
        console.log("Error in sendNotification: ", error);
      }
    },
    []
  );

  const fetchNotifications = useCallback(() => {
    if (!currentUser.uid) return;
    const myNotificationQuery = query(
      collection(db, "notifications"),
      where("to", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(
      myNotificationQuery,
      (querySnapshot: QuerySnapshot<unknown, DocumentData>) => {
        let notifications: UserNotification[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          const notificationData = doc.data() as UserNotification;
          notifications.push({ ...notificationData, _id: doc.id });
        });
        // Sorting with time
        notifications = notifications.sort((a, b) => b.timestamp - a.timestamp);
        dispatch(
          setNotifications({ status: STATUSES.IDLE, data: [...notifications] })
        );
      }
    );
    return unsubscribe;
  }, [dispatch, currentUser]);

  const handleNotificationDropdown = useCallback(
    async (opened: boolean) => {
      if (!unReadNotifications.length || !opened) return;
      try {
        unReadNotifications.forEach(async (notification: UserNotification) => {
          const notfRef = doc(db, "notifications", notification._id!);
          const notfDoc = await getDoc(notfRef);
          if (notfDoc.exists()) {
            await updateDoc(notfRef, {
              isNotificationRead: true,
            });
          } else {
            console.log(`Document with ID ${notification._id} does not exist.`);
          }
        });
        unReadNotifications = [];
      } catch (error) {
        console.log("Error in handleNotificationDropdown", error);
      }
    },
    [unReadNotifications, currentUser]
  );

  const handleOnNotification = useCallback(
    (notification: UserNotification) => {
      const isFriend = friends.data.find(
        (friend: Friend) => friend.uid === notification.by
      ); //This will give friend obj

      if (!isFriend && notification.type === "Request Received")
        router.push("?tab=requests");

      if (isFriend) handleOnChatUser(isFriend);
    },
    [handleOnChatUser, friends, router]
  );

  return {
    sendNotification,
    fetchNotifications,
    handleNotificationDropdown,
    handleOnNotification,
    unReadNotifications,
    notifications,
  };
};

export default useNotification;
