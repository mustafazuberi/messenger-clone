import { database } from "@/db/firebase.config";
import { RootState } from "@/store";
import { setActiveUsers } from "@/store/slice/activeUsersSlice";
import { OnlineInfo } from "@/types/types.miscellaneous";
import {
  ref,
  onDisconnect,
  onValue,
  serverTimestamp,
  update,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

const useActive = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeUsers: { [x: string]: OnlineInfo } = useSelector(
    (state: RootState) => state.activeUsers
  );

  const handleOnDisconnectAndConnect = () => {
    const userIsActiveRef = ref(database, `users/${currentUser.uid}`);
    update(userIsActiveRef, {
      isActive: true,
    });
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
        let activeData = {};
        for (const userId in allUsers) {
          activeData = {
            ...activeData,
            [userId]: {
              isActive: allUsers[userId].isActive,
              lastActive: allUsers[userId].lastActive,
            },
          };
        }
        dispatch(
          setActiveUsers({
            ...activeUsers,
            ...activeData,
          })
        );
      }
    });
  };

  return {
    handleOnDisconnectAndConnect,
    detectingConnectionState,
  };
};

export default useActive;
