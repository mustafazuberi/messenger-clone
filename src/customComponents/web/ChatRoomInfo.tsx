import { FaInfoCircle } from "react-icons/fa";
import { PiShareFatFill } from "react-icons/pi";
import { TbBellFilled } from "react-icons/tb";
import { ImBlocked } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
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
import UserImageAvatar from "./UserImageAvatar";
import Image from "next/image";
import ShareFriendWithModal from "./ShareFriendWithModal";

const ChatRoomFriendInfo = ({ chatWith }: { chatWith: Friend }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <FaInfoCircle className="text-2xl cursor-pointer" />
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
  return (
    <main className="w-full flex flex-col gap-y-3 justify-between items-center">
      <section className="px-6 flex justify-center">
        {chatWith.photoUrl ? (
          <Image
            src={chatWith.photoUrl}
            alt="Profile Info Profile Picture"
            width={100}
            height={100}
            className="w-40 h-40 rounded-full"
          />
        ) : (
          <div
            className={`w-40 h-40 rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
          >
            {chatWith.displayName.charAt(0)[0]?.toUpperCase()}
          </div>
        )}
      </section>
      <section className="max-w-40 text-center">
        <h3 className="text-gray-300 text-4xl font-extrabold">
          {chatWith.displayName}
        </h3>
        <span className="text-gray-400 text-[11 px] font-extralight italic">
          {chatWith.email}
        </span>
      </section>
    </main>
  );
};

const ChatRoomInfoShareButton = () => {
  return (
    <Dialog>
      <section className="flex justify-center mt-2">
        <DialogTrigger >
          <span className="p-4 hover:bg-gray-700 w-14 h-14 flex justify-center items-center rounded-full opacity-40 cursor-pointer duration-300">
            <PiShareFatFill className="text-2xl" />
          </span>
        </DialogTrigger>
      </section>
      <ShareDialog />
    </Dialog>
  );
};

const ChatRoomInfoOptions = () => {
  return (
    <section className="flex flex-col w-full">
      <section className="flex items-center w-full justify-between px-6 py-3 hover:bg-gray-900 cursor-pointer duration-300">
        <Label
          htmlFor="airplane-mode"
          className="font-extralight flex flex-row gap-x-4 items-center cursor-pointer"
        >
          <TbBellFilled className="text-2xl text-gray-400" />
          <span className="text-[15px]">Mute Notifications</span>
        </Label>
        <Switch id="airplane-mode" className="text-gray-500" />
      </section>
      <AlertDialog>
        <AlertDialogTrigger>
          <section className="flex items-center gap-x-4 w-full text-red-500 hover:opacity-70 py-3 px-6 hover:bg-gray-900 cursor-pointer duration-300">
            <ImBlocked className="text-2xl " />
            <span className="text-[17px]">Block Mustafa</span>
          </section>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <BlockUserModal />
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

const BlockUserModal = () => {
  return (
    <section>
      <AlertDialogHeader>
        <AlertDialogTitle>Block Mustafa?</AlertDialogTitle>
        <AlertDialogDescription>
          Blocked contacts will no longer be able to call you or send you
          messages. This contact will not be notified.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-3">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>
          <Button>Block</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </section>
  );
};

const DeleteChatModal = () => {
  return (
    <section>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-3">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>
          <Button>Delete</Button>
        </AlertDialogAction>
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
