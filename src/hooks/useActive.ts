import { database } from "@/db/firebase.config";
import { RootState } from "@/store";
import { OnlineInfo } from "@/types/types.miscellaneous";
import {
  ref,
  onDisconnect,
  onValue,
  serverTimestamp,
  update,
} from "firebase/database";
import { useState } from "react";
import { useSelector } from "react-redux";

const useActive = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const [activeUsers, setActiveUsers] = useState<{ [x: string]: OnlineInfo }>(
    {}
  );

  const handleOnDisconnectAndConnect = () => {
    const userIsActiveRef = ref(database, `users/${currentUser.uid}`);
    // Use update to set the value to true
    update(userIsActiveRef, {
      isActive: true,
    });
    // Set up disconnection handling
    onDisconnect(userIsActiveRef).set({
      isActive: false,
      lastActive: serverTimestamp(),
    });
  };

  const detectingConnectionState = () => {
    const connectedRef = ref(database, `users`);
    onValue(connectedRef, (snap) => {
      if (snap.val()) {
        const allUsers = snap.val();
        for (const userId in allUsers) {
          setActiveUsers((prev) => ({
            ...prev,
            [userId]: {
              isActive: allUsers[userId].isActive,
              lastActive: allUsers[userId].lastActive,
            },
          }));
        }
      }
    });
  };

  return {
    handleOnDisconnectAndConnect,
    detectingConnectionState,
    activeUsers,
  };
};

export default useActive;
