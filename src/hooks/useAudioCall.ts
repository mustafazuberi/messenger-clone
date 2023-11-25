import {
  clearActiveCall,
  setActiveCall,
  setCalls,
} from "@/store/slice/callSlice";
import { useRef, useState } from "react";
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
  const [webcamActive, setWebcamActive] = useState<boolean>(false);

  const setupSources = async (mode: string) => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    if (localRef.current) {
      console.log("settting local ref  creating");
      localRef.current.srcObject = localStream;
    }
    if (remoteRef.current) {
      console.log("settting remote ref  creating");
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

      // Call your custom function (doAnswer) passing the document ID and status

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp!,
        type: offerDescription.type!,
      };

      // Update the document with the offer data
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
      console.log("here in receive call function");
      const callDoc = doc(collection(db, "calls"), callId);
      console.log("in receive call call Id is", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
      };

      const callData = (await getDoc(callDoc)).data();
      console.log("receive call data", callData);
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
      console.log("pc.connectionState", pc.connectionState);
      if (pc.connectionState === "disconnected") {
        pc.close();
      }
    };
  };

  const handleIntiateCall = async () => {
    await setupSources("create");
  };

  const handleOnRecieveCall = async () => {
    await setupSources("join");
    await doAnswer(callId, CALL_STATUS.ONGOING);
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
      pc.close();
    } catch (error) {
      console.log("Error in handleOnCancelCall", error);
    }
  };

  const handleOnRejectCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.DONE);
      await updateIsActiveFalse(callId);
      pc.close();
    } catch (error) {
      console.log("error in handleOnRejectCall", error);
    }
  };

  const handleMissedCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.MISSED);
      await updateIsActiveFalse(callId);
      pc.close();
    } catch (error) {
      console.log("error in handleMissedCall", error);
    }
  };

  const handleOnEndConversation = async () => {
    if (!activeCall?.id!) return;
    pc.close();
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
    handleMissedCall,
    getCurrentUserCalls,
    handleIntiateCall,
    handleOnEndConversation,
    pc,
    handleOnRecieveCall,
    localRef,
    remoteRef,
  };
};

export default useAudioCall;
