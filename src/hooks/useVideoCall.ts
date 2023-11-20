import { RootState } from "@/store";
import { VideoCall } from "@/types/types.miscellaneous";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useVideoCall = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);
  const [videoCallDialog, setVideoCallDialog] = useState<VideoCall | null>(
    null
  );

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const handleOnVideoCall = () => {
    const callDialogProps: VideoCall = {
      open: true,
      calledBy: currentUser,
      callTo: chatWith!,
      callStatus: "connecting",
      room: activeRoom.roomDetails!,
    };
    setVideoCallDialog(callDialogProps);
  };

  const handleVideoCallHangup = () => {};

  return {
    handleOnVideoCall,
    videoCallDialog,
    handleVideoCallHangup,
  };
};

export default useVideoCall;
