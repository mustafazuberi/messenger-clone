import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/db/firebase.config";
import { USER_INITIAL_STATE } from "@/store/intialState";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import { updateUserDetails } from "@/store/slice/userSlice";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const useHome = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
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

  return { handleOnSearchMessenger, handleSignOut };
};

export default useHome;
