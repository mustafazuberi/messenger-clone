import { FaInfoCircle } from "react-icons/fa";
import { PiShareFatFill } from "react-icons/pi";
import { ImBlocked } from "react-icons/im";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Friend from "@/types/type.friend";
import Image from "next/image";
import ShareFriendWithModal from "./ShareFriendWithModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import useChat from "@/hooks/useChat";
import { useMemo, useState } from "react";

const ChatRoomFriendInfo = ({ chatWith }: { chatWith: Friend }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <FaInfoCircle className="text-2xl cursor-pointer text-gray-700 dark:text-gray-300" />
      </SheetTrigger>
      <SheetContent className="max-w-80 w-full border py-6">
        <section className="flex flex-col gap-y-2">
          <ChatRoomFriendBasicInfo chatWith={chatWith} />
          <ChatRoomInfoShareButton />
        </section>
        <ChatRoomInfoOptions />
      </SheetContent>
    </Sheet>
  );
};

export default ChatRoomFriendInfo;

const ChatRoomFriendBasicInfo = ({ chatWith }: { chatWith: Friend }) => {
  const photoUrl = useMemo(() => chatWith.photoUrl, [chatWith.photoUrl]);
  const displayName = useMemo(
    () => chatWith.displayName,
    [chatWith.displayName]
  );
  const email = useMemo(() => chatWith.email, [chatWith.email]);

  return (
    <main className="w-full flex flex-col gap-y-3 justify-between items-center">
      <section className="px-6 flex justify-center">
        {chatWith.photoUrl ? (
          <Image
            src={photoUrl!}
            alt="Profile Info Profile Picture"
            width={100}
            height={100}
            className="w-40 h-40 rounded-full"
          />
        ) : (
          <div
            className={`w-40 h-40 rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
          >
            {chatWith?.displayName[0]}
          </div>
        )}
      </section>
      <section className="max-w-40 text-center">
        <h3 className="text-gray-700 dark:text-gray-300 text-4xl font-extrabold">
          {displayName}
        </h3>
        <span className="text-gray-700 dark:text-gray-300 font-extralight italic">
          {email}
        </span>
      </section>
    </main>
  );
};

const ChatRoomInfoShareButton = () => {
  return (
    <Dialog>
      <section className="flex justify-center mt-2">
        <DialogTrigger>
          <span className="p-4 dark:hover:bg-slate-800 hover:bg-gray-300 w-14 h-14 flex justify-center items-center rounded-full opacity-40 cursor-pointer duration-300">
            <PiShareFatFill className="text-2xl" />
          </span>
        </DialogTrigger>
      </section>
      <ShareDialog />
    </Dialog>
  );
};

const ChatRoomInfoOptions = () => {
  const [isBlockAlertOpen, setIsBlockAlertOpen] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const user = useSelector((state: RootState) => state.activeRoom.chatWith);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);

  const blockedByMe = useMemo(() => {
    return activeRoom.roomDetails?.block?.blockedBy[currentUser.uid]
      ? true
      : false;
  }, [activeRoom.roomDetails?.block, currentUser.uid]);

  return (
    <section className="flex flex-col w-full gap-y-4">
      {!blockedByMe ? (
        <AlertDialog open={isBlockAlertOpen}>
          <AlertDialogTrigger>
            <section
              className="flex items-center gap-x-4 w-full hover:opacity-70 py-3 px-6 dark:hover:bg-slate-800 hover:bg-gray-300 cursor-pointer duration-300"
              onClick={() => setIsBlockAlertOpen(true)}
            >
              <ImBlocked className="text-2xl text-red-500 " />
              <span className="text-[17px] ">Block {user?.displayName} ? </span>
            </section>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <BlockUserModal setIsBlockAlertOpen={setIsBlockAlertOpen} />
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <UnblockOption />
      )}
      {/* About (Bio) */}
      {user?.bio && (
        <section className="w-full px-6 py-3 flex flex-col bg-slate-800">
          <h6 className="opacity-60">~About</h6>
          <p className="mt-2">{user.bio}</p>
        </section>
      )}
    </section>
  );
};

const BlockUserModal = ({
  setIsBlockAlertOpen,
}: {
  setIsBlockAlertOpen: (val: boolean) => void;
}) => {
  const user = useSelector((state: RootState) => state.activeRoom.chatWith);
  const { handleOnBlock, blockingOper } = useChat();
  const handleOnBlockButton = async () => {
    await handleOnBlock();
    setIsBlockAlertOpen(false);
  };
  return (
    <section>
      <AlertDialogHeader>
        <AlertDialogTitle>Block {user?.displayName}?</AlertDialogTitle>
        <AlertDialogDescription>
          Blocked contacts will no longer be able to call you or send you
          messages. This contact will not be notified.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-3">
        <AlertDialogCancel onClick={() => setIsBlockAlertOpen(false)}>
          Cancel
        </AlertDialogCancel>
        <Button onClick={() => handleOnBlockButton()}>
          {blockingOper ? "Please wait..." : "Block"}
        </Button>
      </AlertDialogFooter>
    </section>
  );
};

const ShareDialog = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share with</DialogTitle>
        <ShareFriendWithModal />
      </DialogHeader>
    </DialogContent>
  );
};

const UnblockOption = () => {
  const {
    handleOnUnblock,
    openUnblockModal,
    setOpenUnblockModal,
    blockingOper,
  } = useChat();
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const blockedByMe = useMemo(() => {
    return activeRoom.roomDetails?.block?.blockedBy[currentUser.uid]
      ? true
      : false;
  }, [activeRoom.roomDetails?.block, currentUser.uid]);

  const handleOnUnblockButton = async () => {
    await handleOnUnblock();
    setOpenUnblockModal(false);
  };

  return (
    <section>
      {blockedByMe && (
        <AlertDialog open={openUnblockModal}>
          <AlertDialogTrigger
            className="flex items-center gap-x-4 min-w-full hover:opacity-70 py-3 px-6 hover:bg-slate-800 cursor-pointer duration-300"
            onClick={() => setOpenUnblockModal(true)}
          >
            <ImBlocked className="text-2xl text-red-500 " />
            <span className="text-[17px] ">
              Unblock {activeRoom.chatWith?.displayName} ?{" "}
            </span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <section>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Unblock {currentUser?.displayName}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You have blocked Mustafa Zuberi. Would you like to unblock
                  him?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-3">
                <AlertDialogCancel onClick={() => setOpenUnblockModal(false)}>
                  Cancel
                </AlertDialogCancel>
                <Button onClick={() => handleOnUnblockButton()}>
                  {blockingOper ? "Please wait..." : "Unblock"}
                </Button>
              </AlertDialogFooter>
            </section>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
};
