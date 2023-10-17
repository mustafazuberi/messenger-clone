import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { STATUSES, USER_INITIAL_STATE } from "@/store/intialState";
import { setAllUsers } from "@/store/slice/allUsersSlice";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import { setMyFriends } from "@/store/slice/friendsSlice";
import { updateUserDetails } from "@/store/slice/userSlice";
import Friend from "@/types/type.friend";
import User from "@/types/types.user";
import { Unsubscribe, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FriendsState, UsersState } from "@/types/types.state";
import ChatRequest from "@/types/types.request";
import {
  setReceivedRequests,
  setRequests,
  setSentRequests,
} from "@/store/slice/chatRequestsSlice";

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
      dispatch(updateUserDetails({ ...USER_INITIAL_STATE })); // setting empty object of current user
      dispatch(setAuthenticationStatus(false)); // setting authentication status false in redux

      dispatch(setAllUsers({ data: [], status: "idle" })); // setting authentication status false in redux
      dispatch(setRequests({ data: [], status: "idle" })); // setting authentication status false in redux
      dispatch(setSentRequests({ data: [], status: "idle" })); // setting authentication status false in redux
      dispatch(setReceivedRequests({ data: [], status: "idle" })); // setting authentication status false in redux
      dispatch(setMyFriends({ data: [], status: "idle" })); // setting authentication status false in redux
      toast({
        description: `Signed out successfully!`,
      });
      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAuthStateChange = () => {};

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
