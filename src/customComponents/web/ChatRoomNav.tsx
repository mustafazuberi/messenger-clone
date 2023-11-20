import { IoCallSharp } from "react-icons/io5";
import { BsFillCameraVideoFill } from "react-icons/bs";
import ChatRoomFriendInfo from "./ChatRoomInfo";
import UserImageAvatar from "./UserImageAvatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { LastActive } from "./ChatUsers";
import { IoIosArrowBack } from "react-icons/io";
import { clearActiveRoom } from "@/store/slice/activeRoomSlice";
import { useMemo } from "react";
import useAudioCall from "@/hooks/useAudioCall";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CallDialog from "./CallDialog";

const ChatRoomNav = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const dispatch = useDispatch();
  const user = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);

  return (
    <main className="flex flex-row justify-between border-b lg:px-5 md:px-5 px-2 py-3">
      <section className="flex flex-row gap-x-2 items-center">
        <section className="lg:hidden md:hidden block">
          <IoIosArrowBack
            className="text-2xl"
            onClick={() => dispatch(clearActiveRoom())}
          />
        </section>
        {user && <UserImageAvatar user={user} size={10} />}
        <section className="flex flex-col">
          <section className="text-gray-700 dark:text-gray-300">
            {user?.displayName}
          </section>
          {user && <LastActive friend={user} />}
        </section>
      </section>
      <section className="flex flex-row gap-x-4 items-center justify-center">
        <AudioCallAndVideoCall />
        {user && <ChatRoomFriendInfo chatWith={user} />}
      </section>
    </main>
  );
};

export default ChatRoomNav;

const AudioCallAndVideoCall = () => {
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const chatWith = useMemo(() => activeRoom.chatWith, [activeRoom.chatWith]);
  const { handleOnVideoCall, handleOnAudioCall, callDialog, setCallDialog } =
    useAudioCall();
  return (
    <main>
      <section className="flex flex-row gap-x-3">
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
                onClick={handleOnAudioCall}
                className="flex flex-row gap-x-2"
              >
                <IoCallSharp className="text-xl" />
                <span>Connect</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* Audio Call */}
        <AlertDialog>
          <AlertDialogTrigger>
            <BsFillCameraVideoFill className="text-2xl cursor-pointer text-gray-700 dark:text-gray-300" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Connect with {chatWith?.displayName} via video call?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={handleOnVideoCall}
                className="flex flex-row gap-x-2 "
              >
                <BsFillCameraVideoFill className="text-xl" />
                <span>Connect</span>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {callDialog ? (
        <Dialog open={callDialog?.open}>
          <DialogContent hideCrossBtn={true}>
            <CallDialog
              callDialogProps={callDialog}
              setCallDialog={setCallDialog}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </main>
  );
};
