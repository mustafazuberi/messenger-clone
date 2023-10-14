import { RootState } from "@/store";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/db/firebase.config";
import Stranger from "@/types/types.stranger";
import User from "@/types/types.user";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import handleFirebaseError from "@/services/firebaseErrorHandling";
import { FirebaseError } from "firebase/app";

const useReq = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { toast } = useToast();

  // For adding receiver in my sent requests
  const addReceiverInSentReqs = async (
    receiver: User
  ): Promise<DocumentReference | null> => {
    const requestTo: Stranger = {
      displayName: receiver.displayName,
      email: receiver.email,
      uid: receiver.uid,
      gender: receiver.gender,
      photoUrl: receiver.photoUrl,
    };

    try {
      const receiverRef = collection(
        db,
        "users",
        currentUser.uid,
        "sent requests"
      );
      const res: DocumentReference = await addDoc(receiverRef, {
        ...requestTo,
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //   This for adding my reqest in receiver received requests
  const addSenderReceiverReceivedReqs = async (
    user: User
  ): Promise<DocumentReference | null> => {
    const sender: Stranger = {
      displayName: user.displayName,
      email: user.email,
      uid: user.uid,
      gender: user.gender,
      photoUrl: user.photoUrl,
    };
    try {
      const receiverRef = collection(
        db,
        "users",
        user.uid,
        "received requests"
      );
      const res: DocumentReference = await addDoc(receiverRef, {
        ...sender,
      });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const sendChatRequest = async (receiver: User): Promise<void> => {
    try {
      // Added In Sent Reqs
      const addedInSentReqs: DocumentReference | null =
        await addReceiverInSentReqs(receiver);
      if (!addedInSentReqs) return;

      // Added sender in receiver received Reqs
      const addedInReceiverReceivedReqs: DocumentReference | null =
        await addSenderReceiverReceivedReqs(currentUser);
      if (!addedInReceiverReceivedReqs) return;

      // add receive req notification in receiver notifications
    } catch (error) {
      console.log(error);
    }
  };

  return { sendChatRequest };
};

export default useReq;
