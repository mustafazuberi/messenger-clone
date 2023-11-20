import { RootState } from "@/store";
import { CallDialogProps } from "@/types/types.miscellaneous";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useWebRTC = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);

  const [callDialog, setCallDialog] = useState<CallDialogProps | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const openUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setButtonsDisabled(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    } catch (error) {
      console.error("Error accessing user media:", error);
    }
  };

  const handleOnAudioCall = () => {
    const callDialogProps: CallDialogProps = {
      open: true,
      calledBy: currentUser,
      callTo: chatWith!,
      callType: "audio call",
      callStatus: "connecting",
      room: activeRoom.roomDetails!,
    };
    setCallDialog(callDialogProps);
  };


  
  const handleOnVideoCall = () => {
    console.log("handleOnVideoCall function called");
  };

  return { handleOnAudioCall, handleOnVideoCall, callDialog, setCallDialog };
};

export default useWebRTC;
