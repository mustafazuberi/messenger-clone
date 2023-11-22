import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import {
  clearActiveCall,
  setActiveCall,
  setCalls,
} from "@/store/slice/callSlice";
import { Call } from "@/types/types.call";
import { Unsubscribe } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const useWebRTC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const callsState = useSelector((state: RootState) => state.calls);
  console.log(callsState);

  const pc = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const doOffer = async (call: Call) => {
    try {
      const callDoc = await addDoc(collection(db, "calls"), call);
      return callDoc;
    } catch (error) {
      console.log("error in do Offer :", error);
      return null;
    }
  };

  const doAnswer = async (callId: string, ans: string) => {
    const ref = doc(db, "calls", callId);
    await updateDoc(ref, {
      callStatus: ans,
    });
  };

  const updateIsActiveFalse = async (callId: string) => {
    try {
      if (!callId) return;
      const ref = doc(db, "calls", callId);
      await updateDoc(ref, {
        isActive: false,
      });
    } catch (error) {
      console.log("error in updateIsActiveFalse:", updateIsActiveFalse);
    }
  };

  const getCurrentUserCalls = (): Unsubscribe => {
    const unsubscribe = onSnapshot(
      query(collection(db, "calls")),
      (querySnapshot) => {
        const calls: Call[] = [];
        querySnapshot.forEach((doc) => {
          if (
            doc.data().from === currentUser.uid ||
            doc.data().to === currentUser.uid
          ) {
            calls.push({ ...(doc.data() as Call), id: doc.id });
          }
        });

        dispatch(setCalls([...calls]));
        // Dispatching if any call active
        const ifAnyCallActive = calls.find((call: Call) => call.isActive);
        ifAnyCallActive
          ? dispatch(setActiveCall({ ...ifAnyCallActive }))
          : dispatch(clearActiveCall());
      }
    );
    return unsubscribe;
  };

  return { pc, doOffer, getCurrentUserCalls, doAnswer, updateIsActiveFalse };
};

export default useWebRTC;
