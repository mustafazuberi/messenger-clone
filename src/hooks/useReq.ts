import { RootState } from "@/store";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
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
import { setSentRequests } from "@/store/slice/sentRequestsSlice";
import { setReceivedRequests } from "@/store/slice/receivedRequestsSlice";

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

  const getSentRequests = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", currentUser.uid, "requests"),
        where("senderId", "==", currentUser.uid)
      ),
      (querySnapshot) => {
        const sentRequests: ChatRequest[] = [];
        querySnapshot.forEach((doc) => {
          const sentRequest = doc.data() as ChatRequest;
          sentRequests.push(sentRequest);
        });
        dispatch(setSentRequests({ data: sentRequests, status: "idle" }));
      }
    );
    return unsubscribe;
  };

  const getReceivedRequests = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "users", currentUser.uid, "requests"),
        where("receiverId", "==", currentUser.uid)
      ),
      (querySnapshot) => {
        const receivedRequests: ChatRequest[] = [];
        querySnapshot.forEach((doc) => {
          const receivedRequest = doc.data() as ChatRequest;
          receivedRequests.push(receivedRequest);
        });
        dispatch(
          setReceivedRequests({ data: receivedRequests, status: "idle" })
        );
      }
    );
    return unsubscribe;
  };

  return {
    sendChatRequest,
    getChatRequests,
    getSentRequests,
    getReceivedRequests,
  };
};

export default useReq;
