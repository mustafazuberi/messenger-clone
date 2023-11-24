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
  getDoc,
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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [cachedLocalPC, setCachedLocalPC] = useState();

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
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // Handle the stream, setLocalStream, etc.
    } catch (error) {
      console.error("Error getting audio permission:", error);
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
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // Convert RTCSessionDescription to serializable format
    const offerData = {
      type: offer.type!,
      sdp: offer.sdp!,
    };

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
      offer: offerData,
    };

    const callDoc = await addDoc(collection(db, "calls"), call); //this will initialize call in firebase
    if (!callDoc) return;
    dispatch(setActiveCall({ ...call, id: callDoc?.id })); //dispatching in redux

    // Web Rtc
    const callId = callDoc?.id;
    pc.onicecandidate = async (event) => {
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }
      console.log("found candidate", event.candidate);
      const candidateData = event.candidate.toJSON();
      await addDoc(
        collection(db, "calls", callId, "calleeCandidates"),
        candidateData
      );
    };

    //
    pc.ontrack = (event) => {
      if (
        event.streams &&
        event.streams[0] &&
        remoteStream !== event.streams[0]
      ) {
        console.log("RemotePC received the stream join", event.streams[0]);
        setRemoteStream(event.streams[0]);
      }
    };

    const roomRef = doc(db, "calls", callId);
    //
    onSnapshot(roomRef, async (querySnapshot) => {
      const data = querySnapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(rtcSessionDescription);
      }
    });

    onSnapshot(
      query(collection(db, "calls", callId, "calleeCandidates")),
      (querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            await pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }
    );
  }, [currentUser?.uid, activeRoom.chatWith?.uid, dispatch]);

  const handleOnReceiveCall = async () => {
    if (!activeCall?.id!) return;
    await getAudioPermission();
    await doAnswer(activeCall?.id!, CALL_STATUS.ONGOING);

    // Web Rtc
    const callId = activeCall!.id!;
    if (!activeCall.offer) return;

    const offer = activeCall.offer!;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    const answerData = {
      sdp: answer.sdp,
      type: answer.type,
    };
    await pc.setLocalDescription(answer);

    const ref = doc(db, "calls", callId);
    await updateDoc(ref, { answerData });

    //
    const unsubscribe = onSnapshot(
      query(collection(db, "calls", activeCall.id!, "callerCandidates")),
      (querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            await pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      }
    );
    return unsubscribe;
  };

  const handleOnEndConversation = async () => {
    if (!activeCall?.id!) return;
    closeWebRtcConnection(); // this will end peer connection
    const callId = activeCall?.id;
    await doAnswer(callId, CALL_STATUS.DONE); // updating call status to DONE
    const ref = doc(db, "calls", callId);
    await updateDoc(ref, {
      answered: true,
      isActive: false,
    }); // updated answered to true in firebase
  };

  return {
    handleOnRejectCall,
    handleOnCancelCall,
    closeWebRtcConnection,
    handleMissedCall,
    getCurrentUserCalls,
    handleIntiateCall,
    handleOnReceiveCall,
    handleOnEndConversation,
    pc,
    localStream,
    remoteStream,
  };
};

export default useAudioCall;
