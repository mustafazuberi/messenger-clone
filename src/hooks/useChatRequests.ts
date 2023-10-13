import { RootState } from "@/store";
import { DocumentReference, addDoc, collection, doc } from "firebase/firestore";
import { db } from "@/db/firebase.config";
import Stranger from "@/types/types.stranger";
import User from "@/types/types.user";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import handleFirebaseError from "@/services/firebase-firestore/firebaseErrorHandling";
import { FirebaseError } from "firebase/app";

const useChatRequests = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { toast } = useToast();

  //   THis for adding my requested Chats
  const addRequestedUserInMyRequestedChats = async (
    user: User
  ): Promise<DocumentReference | null> => {
    const requestTo: Stranger = {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      gender: user.gender,
      photoUrl: user.photoUrl,
    };

    try {
      const res: DocumentReference = await addDoc(
        collection(db, "users", currentUser.uid, "myRequestedChats"),
        {
          ...requestTo,
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      const message = handleFirebaseError(error as FirebaseError);
      if (message) {
        toast({
          variant: "destructive",
          description: message,
        });
      }
      return null;
    }
  };

  //   This for adding my reqest in requested user received requests
  const addMyReqInRequestedUserReqs = async (
    user: User
  ): Promise<DocumentReference | null> => {
    const infoForMyReq: Stranger = {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      gender: user.gender,
      photoUrl: user.photoUrl,
    };
    try {
      const res: DocumentReference = await addDoc(
        collection(db, "users", user.uid, "chatRequests"),
        {
          ...infoForMyReq,
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      const message = handleFirebaseError(error as FirebaseError);
      if (message) {
        toast({
          variant: "destructive",
          description: message,
        });
      }
      return null;
    }
  };

  const sendChatRequest = async (user: User) => {
    try {
      // here adding user in my requested chats
      const addedInMyRequested = await addRequestedUserInMyRequestedChats(user);
      if (!addedInMyRequested) return;

      // here adding my request in friend requests of user i sent request
      const addedInRequestedUser = await addMyReqInRequestedUserReqs(user);
      if (!addedInRequestedUser) return;
    } catch (error) {}
  };

  return { sendChatRequest };
};

export default useChatRequests;
