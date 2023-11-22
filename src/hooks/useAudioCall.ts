import { clearActiveCall } from "@/store/slice/callSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebRTC from "./useWebRTC";
import { RootState } from "@/store";
import { CALL_STATUS, Call } from "@/types/types.call";

const useAudioCall = () => {
  const dispatch = useDispatch();
  const activeCall = useSelector((state: RootState) => state.calls.activeCall);
  const { pc, doAnswer, updateIsActiveFalse } = useWebRTC();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const handleOnCancelCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.CANCELLED);
      await updateIsActiveFalse(callId);
      clearingWebRtcConnection();
    } catch (error) {
      console.log("Error in handleOnCancelCall", error);
    }
  };

  const handleOnRejectCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.DONE);
      await updateIsActiveFalse(callId);
      clearingWebRtcConnection();
    } catch (error) {
      console.log("error in handleOnRejectCall", error);
    }
  };

  const handleMissedCall = async () => {
    const callId = activeCall?.id!;
    try {
      await doAnswer(callId, CALL_STATUS.MISSED);
      await updateIsActiveFalse(callId);
      clearingWebRtcConnection();
    } catch (error) {
      console.log("error in handleMissedCall", error);
    }
  };

  const clearingWebRtcConnection = () => {
    pc.close();
    setLocalStream(null);
    setRemoteStream(null);
    dispatch(clearActiveCall());
  };

  // This will run when current user is calling someone
  const handleOnInitiateCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
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
    // Setting in states
    setLocalStream(localStream);
    setRemoteStream(remoteStream);

    
  };

  const handleAudioCall = async () => {};

  const handleOnReceiveCall = () => {};

  return {
    handleAudioCall,
    handleOnRejectCall,
    handleOnCancelCall,
    clearingWebRtcConnection,
    handleMissedCall,
  };
};

export default useAudioCall;
