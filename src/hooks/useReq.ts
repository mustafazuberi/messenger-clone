import { RootState } from "@/store";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
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
import {
  setRequests,
  setReceivedRequests,
  setSentRequests,
} from "@/store/slice/chatRequestsSlice";
import { Unsubscribe } from "firebase/messaging";

type SendChatReqParam = {
  sender: Stranger;
  receiver: Stranger;
};

type ConfirmChatReqParam = {
  sender: Stranger;
  receiver: Stranger;
};

type UnsentChatReqParam = {
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

  const unsentChatRequest = async (request: ChatRequest): Promise<void> => {
    if (!request.id) return;
    try {
      await deleteDoc(
        doc(db, "users", request.senderId, "requests", request.id)
      );
      await deleteDoc(
        doc(db, "users", request.receiverId, "requests", request.id)
      );
      toast({
        description: "Request Unsent!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmChatRequest = async (request: ChatRequest): Promise<void> => {
    console.log(request);
  };

  const getChatRequests = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      collection(db, "users", currentUser.uid, "requests"),
      (querySnapshot) => {
        const chatRequests: ChatRequest[] = [];
        querySnapshot.forEach((doc) => {
          const chatRequest = { ...doc.data(), id: doc.id } as ChatRequest;
          chatRequests.push(chatRequest);
        });
        dispatch(setRequests({ data: chatRequests, status: "idle" }));
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
          const sentRequest = { ...doc.data(), id: doc.id } as ChatRequest;
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
          const receivedRequest = { ...doc.data(), id: doc.id } as ChatRequest;
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
    unsentChatRequest,
    confirmChatRequest,
    getChatRequests,
    getSentRequests,
    getReceivedRequests,
  };
};

export default useReq;
