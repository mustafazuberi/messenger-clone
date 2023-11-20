import { RootState } from "@/store";
import { CallDialogProps } from "@/types/types.miscellaneous";
import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useAudioCall = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);

  const [callDialog, setCallDialog] = useState<CallDialogProps | null>(null);

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

  const handleOnVideoCall = async () => {
    const callDialogProps: CallDialogProps = {
      open: true,
      calledBy: currentUser,
      callTo: chatWith!,
      callType: "video call",
      callStatus: "connecting",
      room: activeRoom.roomDetails!,
    };
    setCallDialog(callDialogProps);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  };

  return {
    handleOnAudioCall,
    handleOnVideoCall,
    callDialog,
    setCallDialog,
  };
};

export default useAudioCall;
