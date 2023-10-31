import { useToast } from "@/components/ui/use-toast";
import { auth, database, db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES } from "@/store/intialState";
import { clearAllUsers, setAllUsers } from "@/store/slice/allUsersSlice";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import { clearFriends, setMyFriends } from "@/store/slice/friendsSlice";
import { clearCurrentUser } from "@/store/slice/userSlice";
import Friend from "@/types/type.friend";
import User from "@/types/types.user";
import { Unsubscribe, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearRequests } from "@/store/slice/chatRequestsSlice";
import { clearActiveRoom } from "@/store/slice/activeRoomSlice";
import { serverTimestamp, set } from "firebase/database";
import { ref } from "firebase/database";

const useHome = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const getAllUsers = (): Unsubscribe => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        if (userData.uid !== currentUser.uid) users.push(userData);
      });

      dispatch(setAllUsers({ status: STATUSES.IDLE, data: users }));
    });
    return unsubscribe;
  };

  const getMyFriends = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "friends"),
      (querySnapshot) => {
        const users: Friend[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as Friend;
          if (userData.uid !== currentUser.uid) users.push(userData);
        });

        dispatch(setMyFriends({ status: STATUSES.IDLE, data: users }));
      }
      //
    );
    return unsubscribe;
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      clearReduxData();
      // Setting user offline
      const userIsActiveRef = ref(database, `users/${currentUser.uid}`);
      set(userIsActiveRef, {
        isActive: false,
        lastActive: serverTimestamp(),
      });
      //
      toast({
        description: `Signed out successfully!`,
      });
      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAuthStateChange = () => {};

  const clearReduxData = () => {
    dispatch(clearCurrentUser());
    dispatch(setAuthenticationStatus(false));
    dispatch(clearAllUsers());
    dispatch(clearRequests());
    dispatch(clearFriends());
    dispatch(clearActiveRoom());
  };

  const handleOnSearchMessenger = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return {
    handleOnSearchMessenger,
    handleSignOut,
    handleAuthStateChange,
    getAllUsers,
    getMyFriends,
  };
};

export default useHome;
