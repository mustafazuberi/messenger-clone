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

        const receiverCollectionDocRef = doc(
          db,
          "users",
          chatRequest.receiverId,
          "requests",
          senderCollectionDocRef.id
        );

        await setDoc(receiverCollectionDocRef, chatRequest);

        await sendNotification({
          type: "Request Received",
          to: receiver,
          by: sender,
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
      const senderRequestRef = doc(
        db,
        "users",
        request.senderId,
        "requests",
        request.id
      );
      const receiverRequestRef = doc(
        db,
        "users",
        request.receiverId,
        "requests",
        request.id
      );

      await Promise.all([
        deleteDoc(senderRequestRef),
        deleteDoc(receiverRequestRef),
      ]);
    } catch (error) {
      console.log("error in deleteRequest", error);
    }
  }, []);

  const fetchRequests = useCallback(
    (
      whereClause: { field: string; value: any } | undefined,
      action: (requests: ChatRequest[]) => void
    ): Unsubscribe => {
      let firestoreCollection: CollectionReference<DocumentData, DocumentData> =
        collection(db, "users", currentUser.uid, "requests");

      let firestoreQuery: Query<DocumentData> = firestoreCollection;

      if (whereClause) {
        firestoreQuery = query(
          firestoreCollection,
          where(whereClause.field, "==", whereClause.value)
        );
      }

      const unsubscribe = onSnapshot(firestoreQuery, (querySnapshot) => {
        const requests: ChatRequest[] = [];
        querySnapshot.forEach((doc) => {
          const request = { ...doc.data(), id: doc.id } as ChatRequest;
          requests.push(request);
        });
        action(requests);
      });

      return unsubscribe;
    },
    [currentUser]
  );

  const getChatRequests = useCallback(() => {
    return fetchRequests(undefined, (requests) =>
      dispatch(setRequests({ data: requests, status: "idle" }))
    );
  }, [dispatch, fetchRequests]);

  const getSentRequests = useCallback(() => {
    return fetchRequests(
      { field: "senderId", value: currentUser.uid },
      (requests) =>
        dispatch(setSentRequests({ data: requests, status: "idle" }))
    );
  }, [currentUser, dispatch, fetchRequests]);

  const getReceivedRequests = useCallback(() => {
    return fetchRequests(
      { field: "receiverId", value: currentUser.uid },
      (requests) =>
        dispatch(setReceivedRequests({ data: requests, status: "idle" }))
    );
  }, [currentUser, dispatch, fetchRequests]);

  return {
    sendChatRequest,
    unsendChatRequest,
    confirmChatRequest,
    getChatRequests,
    getSentRequests,
    getReceivedRequests,
    loading,
  };
};

export default useReq;
