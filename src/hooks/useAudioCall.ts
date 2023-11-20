import { db } from "@/db/firebase.config";
import { RootState } from "@/store";
import { AudioCall } from "@/types/types.miscellaneous";
import { doc, onSnapshot } from "firebase/firestore";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useAudioCall = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);
  const [audioCallDialog, setAudioCallDialog] = useState<AudioCall | null>(
    null
  );
  const peerConnection = useMemo(
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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );

  function registerPeerConnectionListeners() {
    peerConnection.addEventListener("icegatheringstatechange", () => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`
      );
    });

    peerConnection.addEventListener("connectionstatechange", () => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);
    });

    peerConnection.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener("iceconnectionstatechange ", () => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`
      );
    });
  }

  async function createRoom() {
    registerPeerConnectionListeners();
    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener("track", (event) => {
      console.log("Got remote track:", event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        console.log("Add a track to the remoteStream:", track);
        remoteStream.addTrack(track);
      });
    });
  }

  const joinRoomById = async (roomId: string) => {
    const unsub = onSnapshot(doc(db, "chatrooms", roomId), (doc) => {
      if (doc.data()) {
        registerPeerConnectionListeners();
        localStream?.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
        peerConnection.addEventListener("track", (event) => {
          console.log("Got remote track:", event.streams[0]);
          event.streams[0].getTracks().forEach((track) => {
            console.log("Add a track to the remoteStream:", track);
            remoteStream.addTrack(track);
          });
        });
      }
    });
    return unsub;
  };

  const handleOnAudioCall = async () => {
    const callDialogProps: AudioCall = {
      open: true,
      calledBy: currentUser,
      callTo: chatWith!,
      callStatus: "connecting",
      room: activeRoom.roomDetails!,
    };
    setAudioCallDialog(callDialogProps);

    // opening audio
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setLocalStream(stream);
    setRemoteStream(new MediaStream());

    // Creating Room
    await createRoom();

    // Joining Room
    await joinRoomById(activeRoom.roomDetails?.id!);
  };

  const handleAudioCallHangup = () => {};

  return {
    handleOnAudioCall,
    audioCallDialog,
    handleAudioCallHangup,
  };
};

export default useAudioCall;
