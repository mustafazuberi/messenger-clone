import { auth, db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { setNotifications } from "@/store/slice/notificationsSlice";
import { SendNotificationParam } from "@/types/types.miscellaneous";
import UserNotification from "@/types/types.notification";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { batch, useDispatch, useSelector } from "react-redux";

const useNotification = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const notifications = useSelector((state: RootState) => state.notifications);
  let unReadNotifications = notifications.data.filter(
    (notf: UserNotification) => !notf.isNotificationRead
  );

  const sendNotification = async ({ by, to, type }: SendNotificationParam) => {
    let message: string = "";
    if (type === "Request Received")
      message = `${by.displayName} has sent you a friend request.`;
    if (type === "Request Accepted")
      message = `${by.displayName} has accepted your friend request.`;

    const notificationObj: UserNotification = {
      isNotificationRead: false,
      isRequestRead: false,
      timestamp: Date.now(),
      type: "Request Received",
      notificationBy: by,
      message,
    };
    const notificationDocRef = collection(db, "users", to.uid, "notifications");
    return addDoc(notificationDocRef, { ...notificationObj });
  };

  const fetchNotifications = () => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "notifications"),
      (querySnapshot) => {
        let notifications: UserNotification[] = [];
        querySnapshot.forEach((doc) => {
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
  };

  const handleNotificationDropdown = async (opened: boolean) => {
    if (!unReadNotifications.length || !opened) return;
    unReadNotifications.forEach(async (notificationRef: UserNotification) => {
      const washingtonRef = doc(
        db,
        "users",
        currentUser.uid,
        "notifications",
        notificationRef._id!
      );
      await updateDoc(washingtonRef, {
        isNotificationRead: true,
      });
    });
    unReadNotifications = [];
  };

  return {
    sendNotification,
    fetchNotifications,
    handleNotificationDropdown,
    unReadNotifications,
    notifications,
  };
};

export default useNotification;
