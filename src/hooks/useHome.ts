import { useToast } from "@/components/ui/use-toast";
import { auth, db, messaging } from "@/db/firebase.config";
import { getToken } from "firebase/messaging";
import { RootState } from "@/store";
import { USER_INITIAL_STATE } from "@/store/intialState";
import { setAllUsers } from "@/store/slice/allUsersSlice";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import { setMyFriends } from "@/store/slice/friendsSlice";
import { updateUserDetails } from "@/store/slice/userSlice";
import Friend from "@/types/type.friend";
import User from "@/types/types.user";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const useHome = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const getAllUsers = () => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as User;
        users.push(userData);
      });
      dispatch(setAllUsers(users));
    });
    return unsubscribe;
  };

  const getMyFriends = () => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "friends"),
      (querySnapshot) => {
        const users: Friend[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as Friend;
          users.push(userData);
        });

        dispatch(setMyFriends(users));
      }
    );
    return unsubscribe;
  };

  const requestPermissionCloudMessaging = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate token
      const token = await getToken(messaging, {
        vapidKey:
          "BEqeZLQXRddjBldjjB7yYbpukTpJSkScJRgehWuStP_hpZxAAsSI3fsrdyOat9waVUoNO0vcbLGCfdJ9Z2hjfaw",
      });
      console.log("token generated---- ", token);
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  };

  const handleOnSearchMessenger = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      dispatch(updateUserDetails({ ...USER_INITIAL_STATE })); // setting empty object of current user
      dispatch(setAuthenticationStatus(false)); // setting authentication status false in redux
      toast({
        description: `Signed out successfully!`,
      });
      router.push("/auth/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleOnSearchMessenger,
    handleSignOut,
    getAllUsers,
    getMyFriends,
    requestPermissionCloudMessaging,
  };
};

export default useHome;
