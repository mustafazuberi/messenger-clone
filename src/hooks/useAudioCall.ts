import {
  clearActiveCall,
  setActiveCall,
  setCalls,
} from "@/store/slice/callSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CALL_STATUS, CALL_TYPE, Call } from "@/types/types.call";
import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase.config";
import { Unsubscribe } from "firebase/auth";

const useAudioCall = () => {
  const dispatch = useDispatch();
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const activeCall = useSelector((state: RootState) => state.calls.activeCall);
  const currentUser = useSelector((state: RootState) => state.currentUser);

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

  const getAudioPermission = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  };

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

  const handleOnCancelCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.CANCELLED);
      await updateIsActiveFalse(callId);
      closeWebRtcConnection();
    } catch (error) {
      console.log("Error in handleOnCancelCall", error);
    }
  };

  const handleOnRejectCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.DONE);
      await updateIsActiveFalse(callId);
      closeWebRtcConnection();
    } catch (error) {
      console.log("error in handleOnRejectCall", error);
    }
  };

  const handleMissedCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.MISSED);
      await updateIsActiveFalse(callId);
      closeWebRtcConnection();
    } catch (error) {
      console.log("error in handleMissedCall", error);
    }
  };

  const closeWebRtcConnection = useCallback(() => {
    pc.close();
    // setLocalStream(null);
    // setRemoteStream(null);
    dispatch(clearActiveCall());
  }, [pc, dispatch]);

  const handleIntiateCall = useCallback(async () => {
    await getAudioPermission();
    const call: Call = {
      to: activeRoom.chatWith?.uid!,
      from: currentUser.uid,
      toUser: { ...activeRoom.chatWith! },
      fromUser: { ...currentUser },
      callStatus: CALL_STATUS.CALLING,
      type: CALL_TYPE.AUDIO,
      answered: false,
      isActive: true,
      createdAt: Date.now(),
    };
    const callDoc = await doOffer({ ...call }); //this will initialize call in firebase
    if (!callDoc) return;
    dispatch(setActiveCall({ ...call, id: callDoc?.id })); //dispatching in redux
  }, [currentUser?.uid, activeRoom.chatWith?.uid, doOffer, dispatch]);

  const handleOnReceiveCall = async () => {
    console.log("here in handleOnReceiveCall function");
    if (!activeCall?.id!) return;
    await getAudioPermission();
    await doAnswer(activeCall?.id!, CALL_STATUS.ONGOING);
  };

  const handleAudioCall = async () => {
    console.log("here in handleAudioCall function");
    if (activeCall?.callStatus !== CALL_STATUS.ONGOING) return;
    console.log(activeCall.id!);
  };

  return {
    handleAudioCall,
    handleOnRejectCall,
    handleOnCancelCall,
    closeWebRtcConnection,
    handleMissedCall,
    getCurrentUserCalls,
    handleIntiateCall,
    handleOnReceiveCall,
  };
};

export default useAudioCall;
