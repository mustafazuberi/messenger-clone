import { db } from "@/db/firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setRequests,
  setReceivedRequests,
  setSentRequests,
} from "@/store/slice/chatRequestsSlice";

import { useToast } from "@/components/ui/use-toast";

import Stranger from "@/types/types.stranger";
import ChatRequest from "@/types/types.request";

import { Unsubscribe } from "firebase/messaging";
import { useState } from "react";

type SendChatReqParam = {
  sender: Stranger;
  receiver: Stranger;
};

const useReq = () => {
  const dispatch = useDispatch();
  const [confirmReqLoading, setConfirmReqLoading] = useState<boolean>(false);
  const [getFriendsAndReqAgain, setGetFriendsAndReqAgain] =
    useState<boolean>(false);
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
      const senderCollectionDocRef = await addDoc(
        senderCollectionRef,
        chatRequest
      );

      // Add the chat request to the receiver's collection
      const receiverCollectionDocRef = doc(
        db,
        "users",
        chatRequest.receiverId,
        "requests",
        senderCollectionDocRef.id
      );
      await setDoc(receiverCollectionDocRef, chatRequest);

      setGetFriendsAndReqAgain((prev) => !prev);
      toast({
        description: `Request Sent to ${receiver.displayName}!`,
      });
    } catch (error) {
      console.error("Error sending chat request:", error);
    }
  };

  const unsendChatRequest = async (request: ChatRequest): Promise<void> => {
    if (!request.id) return;
    try {
      await deleteDoc(
        doc(db, "users", request.senderId, "requests", request.id)
      );
      await deleteDoc(
        doc(db, "users", request.receiverId, "requests", request.id)
      );

      setGetFriendsAndReqAgain((prev) => !prev);
      toast({
        description: "Request Unsent!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmChatRequest = async (request: ChatRequest): Promise<void> => {
    if (!request.id) return;
    setConfirmReqLoading(true);
    try {
      // adding him in accepter friends
      await setDoc(
        doc(db, "users", request.receiverId, "friends", request.senderId),
        { ...request.sender }
      );

      // adding receiver in sender friends
      await setDoc(
        doc(db, "users", request.senderId, "friends", request.receiverId),
        { ...request.receiver }
      );

      await deleteDoc(
        doc(db, "users", request.senderId, "requests", request.id)
      );
      await deleteDoc(
        doc(db, "users", request.receiverId, "requests", request.id)
      );

      setConfirmReqLoading(false);
      setGetFriendsAndReqAgain((prev) => !prev);
      toast({
        description: `You and ${request.sender.displayName} are now friends!`,
      });
    } catch (error) {
      setConfirmReqLoading(false);
      console.log(error);
    }
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
        console.log("sentRequests", sentRequests);
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
    unsendChatRequest,
    confirmChatRequest,
    getChatRequests,
    getSentRequests,
    getReceivedRequests,
    confirmReqLoading,
    getFriendsAndReqAgain,
  };
};

export default useReq;
