import {
  clearActiveCall,
  setActiveCall,
  setCalls,
} from "@/store/slice/callSlice";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { CALL_STATUS, CALL_TYPE, Call } from "@/types/types.call";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase.config";
import { Unsubscribe } from "firebase/auth";

const useAudioCall = () => {
  // Initialize WebRTC
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const pc = new RTCPeerConnection(servers);

  const dispatch = useDispatch();
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const activeCall = useSelector((state: RootState) => state.calls.activeCall);
  const callId = activeCall?.id!;
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [myStream, setMyStream] = useState<null | MediaStream>(null);
  const [remoteStream, setRemoteStream] = useState<null | MediaStream>(null);
  const [webcamActive, setWebcamActive] = useState<boolean>(false);

  const setupSources = useCallback(async (mode: string) => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    setMyStream(localStream);
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      const streams = event.streams[0];
      setRemoteStream(streams);
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    if (localRef.current) {
      localRef.current.srcObject = localStream;
    }
    if (remoteRef.current) {
      remoteRef.current.srcObject = remoteStream;
    }
    setWebcamActive(true);

    if (mode === "create") {
      // Create a document without data to obtain the reference
      const callDocRef = await addDoc(collection(db, "calls"), {});
      // Now use the obtained reference to create subcollections
      const callDoc = doc(db, "calls", callDocRef.id);
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp!,
        type: offerDescription.type!,
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
        offer: offer,
      };
      await setDoc(callDoc, { ...call });

      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (mode === "join") {
      const callDoc = doc(collection(db, "calls"), callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
      };

      const callData = (await getDoc(callDoc)).data();
      const offerDescription = callData?.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await updateDoc(callDoc, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        closePeerConnection();
      }
    };
  }, []);

  const handleIntiateCall = useCallback(async () => {
    await setupSources("create");
  }, [setupSources]);

  const handleOnRecieveCall = useCallback(async () => {
    await setupSources("join");
    await doAnswer(callId, CALL_STATUS.ONGOING);
  }, [callId, setupSources]);

  const doAnswer = useCallback(async (callId: string, ans: string) => {
    const ref = doc(db, "calls", callId);
    await updateDoc(ref, {
      callStatus: ans,
    });
  }, []);

  const updateIsActiveFalse = useCallback(async (callId: string) => {
    try {
      if (!callId) return;
      const ref = doc(db, "calls", callId);
      await updateDoc(ref, {
        isActive: false,
      });
    } catch (error) {
      console.log("error in updateIsActiveFalse:", updateIsActiveFalse);
    }
  }, []);

  const getCurrentUserCalls = useCallback((): Unsubscribe => {
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
  }, [currentUser, dispatch]);

  const handleOnCancelCall = useCallback(async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.CANCELLED);
      await updateIsActiveFalse(callId);
      closePeerConnection();
    } catch (error) {
      console.log("Error in handleOnCancelCall", error);
    }
  }, [activeCall?.id, doAnswer, updateIsActiveFalse, pc]);

  const handleOnRejectCall = useCallback(async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.DONE);
      await updateIsActiveFalse(callId);
      closePeerConnection();
    } catch (error) {
      console.log("error in handleOnRejectCall", error);
    }
  }, [activeCall?.id, doAnswer, updateIsActiveFalse, pc]);

  const handleMissedCall = useCallback(async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.MISSED);
      await updateIsActiveFalse(callId);
      pc.close();
    } catch (error) {
      console.log("error in handleMissedCall", error);
    }
  }, [activeCall?.id, doAnswer, updateIsActiveFalse, pc]);

  const handleOnEndConversation = useCallback(async () => {
    if (!activeCall?.id!) return;
    closePeerConnection;
    const callId = activeCall?.id;
    await doAnswer(callId, CALL_STATUS.DONE); // updating call status to DONE
    const ref = doc(db, "calls", callId);
    await updateDoc(ref, {
      answered: true,
      isActive: false,
    }); // updated answered to true in firebase
  }, [activeCall, doAnswer, updateDoc, pc]);

  const closePeerConnection = async () => {
    myStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: false,
    });
    pc.close();
  };

  return {
    handleOnRejectCall,
    handleOnCancelCall,
    handleMissedCall,
    getCurrentUserCalls,
    handleIntiateCall,
    handleOnEndConversation,
    pc,
    handleOnRecieveCall,
    localRef,
    remoteRef,
    myStream,
    remoteStream,
    setMyStream,
    setRemoteStream,
  };
};

export default useAudioCall;
