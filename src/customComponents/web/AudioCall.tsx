import { RootState } from "@/store";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IoCallSharp } from "react-icons/io5";
import { setActiveCall } from "@/store/slice/callSlice";
import useWebRTC from "@/hooks/useWebRTC";
import { CALL_STATUS, CALL_TYPE, Call } from "@/types/types.call";

const AudioCall = () => {
  const dispatch = useDispatch();
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);
  const { doOffer } = useWebRTC();

  const handleOnConnectAudioCall = useCallback(async () => {
    const call: Call = {
      to: chatWith?.uid!,
      from: currentUser.uid,
      toUser: { ...chatWith! },
      fromUser: { ...currentUser },
      callStatus: CALL_STATUS.CALLING,
      type: CALL_TYPE.AUDIO,
      answered: false,
      isActive: true,
      createdAt: Date.now(),
    };
    const callDoc = await doOffer({ ...call }); //this will initialize call in firebase
    dispatch(setActiveCall({ ...call, id: callDoc?.id })); //dispatching in redux
  }, [currentUser?.uid, chatWith?.uid, doOffer, dispatch]);

  return (
    <main>
      <AlertDialog>
        <AlertDialogTrigger>
          <IoCallSharp className="text-2xl cursor-pointer text-gray-700 dark:text-gray-300" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Connect with {chatWith?.displayName} via call?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleOnConnectAudioCall}
              className="flex flex-row gap-x-2"
            >
              <IoCallSharp className="text-xl" />
              <span>Connect</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default AudioCall;
