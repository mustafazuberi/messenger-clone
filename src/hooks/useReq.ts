import { RootState } from "@/store";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/db/firebase.config";
import Stranger from "@/types/types.stranger";
import User from "@/types/types.user";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import handleFirebaseError from "@/services/firebaseErrorHandling";
import { FirebaseError } from "firebase/app";
import ChatRequest from "@/types/types.request";
import { setChatRequests } from "@/store/slice/chatRequestsSlice";
import { Unsubscribe } from "firebase/messaging";

type SendChatReqParam = {
  sender: Stranger;
  receiver: Stranger;
};

const useReq = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { toast } = useToast();

  // Function to send a chat request
  const sendChatRequest = async ({
    sender,
    receiver,
  }: SendChatReqParam): Promise<void> => {
    // Create the chat request object
    const chatRequest: ChatRequest = {
      senderId: sender.uid,
      receiverId: receiver.uid,
      sender: sender,
      receiver: receiver,
      isRead: false,
    };
    try {
      // Add the chat request to the sender's collection
      const senderCollectionRef = collection(
        db,
        "users",
        chatRequest.senderId,
        "requests"
      );
      await addDoc(senderCollectionRef, chatRequest);

      // Add the chat request to the receiver's collection
      const receiverCollectionRef = collection(
        db,
        "users",
        chatRequest.receiverId,
        "requests"
      );
      await addDoc(receiverCollectionRef, chatRequest);

      toast({
        description: `Request Sent to ${receiver.displayName}!`,
      });
    } catch (error) {
      console.error("Error sending chat request:", error);
    }
  };

  const getChatRequests = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "requests"),
      (querySnapshot) => {
        const chatRequests: ChatRequest[] = [];
        querySnapshot.forEach((doc) => {
          const chatRequest = doc.data() as ChatRequest;
          chatRequests.push(chatRequest);
        });
        dispatch(setChatRequests({ data: chatRequests, status: "idle" }));
      }
    );
    return unsubscribe;
  };

  return { sendChatRequest, getChatRequests };
};

export default useReq;
