import {
  CollectionReference,
  DocumentData,
  Query,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Unsubscribe } from "firebase/messaging";
import { db } from "@/db/firebase.config";
import { useToast } from "@/components/ui/use-toast";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setRequests,
  setReceivedRequests,
  setSentRequests,
} from "@/store/slice/chatRequestsSlice";
import ChatRequest from "@/types/types.request";
import { SendChatReqParam } from "@/types/types.miscellaneous";
import useNotification from "./useNotification";
import useChat from "./useChat";
import { useCallback, useState } from "react";

const useReq = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { toast } = useToast();
  const { sendNotification } = useNotification();
  const { createChatRoom } = useChat();

  const sendChatRequest = useCallback(
    async ({ sender, receiver }: SendChatReqParam) => {
      setLoading(true);
      const chatRequest: ChatRequest = {
        senderId: sender.uid,
        receiverId: receiver.uid,
        sender,
        receiver,
        isRead: false,
      };

      try {
        const reqDoc = await addDoc(collection(db, "requests"), chatRequest);
        if (!reqDoc?.id) return;

        await sendNotification({
          type: "Request Received",
          to: receiver,
          by: sender,
          requestId: reqDoc?.id,
        });
        setLoading(false);
        toast({
          description: `Request Sent to ${receiver.displayName}!`,
        });
      } catch (error) {
        setLoading(false);
        console.error("Error sending chat request:", error);
      }
    },
    [toast, setLoading, sendNotification]
  );

  const unsendChatRequest = useCallback(
    async (request: ChatRequest) => {
      if (!request.id) return;
      setLoading(true);

      try {
        await deleteRequest(request);
        toast({
          description: "Request Unsent!",
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
    [toast, setLoading]
  );

  const confirmChatRequest = useCallback(
    async (request: ChatRequest) => {
      if (!request.id) return;
      setLoading(true);
      try {
        const receiverFriendRef = doc(
          db,
          "users",
          request.receiverId,
          "friends",
          request.senderId
        );
        const senderFriendRef = doc(
          db,
          "users",
          request.senderId,
          "friends",
          request.receiverId
        );

        await Promise.all([
          setDoc(receiverFriendRef, { ...request.sender }),
          setDoc(senderFriendRef, { ...request.receiver }),
          deleteRequest(request),
          sendNotification({
            type: "Request Accepted",
            to: request.sender,
            by: request.receiver,
            requestId: request.id,
          }),
          createChatRoom({
            sender: request.sender,
            reciever: request.receiver,
          }),
        ]);

        toast({
          description: `You and ${request.sender.displayName} are now friends!`,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },
    [toast, setLoading, sendNotification, createChatRoom]
  );

  const deleteRequest = useCallback(async (request: ChatRequest) => {
    if (!request.id) return;
    try {
      await deleteDoc(doc(db, "requests", request.id));
    } catch (error) {
      console.log("error in deleteRequest", error);
    }
  }, []);

  const getChatRequests = useCallback(() => {
    const unsubscribe = onSnapshot(
      collection(db, "requests"),
      (querySnapshot) => {
        const requests: ChatRequest[] = [];
        querySnapshot.forEach((doc) => {
          const request = { ...doc.data(), id: doc.id } as ChatRequest;
          requests.push(request);
        });
        dispatch(setRequests({ data: requests, status: "idle" }));

        // Filtering sentRequests and setting in redux
        const sentRequests = requests.filter(
          (chatReq: ChatRequest) => chatReq.senderId === currentUser.uid
        );
        dispatch(setSentRequests({ data: sentRequests, status: "idle" }));

        //Filtering  received Requests and setting in redux
        const recievedRequests = requests.filter(
          (chatReq: ChatRequest) => chatReq.receiverId === currentUser.uid
        );
        dispatch(
          setReceivedRequests({ data: recievedRequests, status: "idle" })
        );
      }
    );

    return unsubscribe;
  }, [dispatch]);

  return {
    sendChatRequest,
    unsendChatRequest,
    confirmChatRequest,
    getChatRequests,
    loading,
  };
};

export default useReq;
