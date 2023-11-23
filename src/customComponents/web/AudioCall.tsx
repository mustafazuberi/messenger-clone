import { RootState } from "@/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
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
import useAudioCall from "@/hooks/useAudioCall";

const AudioCall = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);
  const { handleIntiateCall } = useAudioCall();

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
              onClick={handleIntiateCall}
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
