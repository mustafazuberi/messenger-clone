"use client";
import { Input } from "@/components/ui/input";
import { BsFillSendFill, BsEmojiSmile } from "react-icons/bs";
import { AiFillAudio, AiFillDelete } from "react-icons/ai";
import { IoMdPhotos } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog } from "@/components/ui/dialog";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useSendMessage from "@/hooks/useSendMessage";
import SendImageModal from "./SendImageModal";
import useSendVoice from "@/hooks/useSendVoice";
import TailwindSpinner from "./TailwindSpinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import useChat from "@/hooks/useChat";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

const ChatRoomFooter = () => {
  const blockInfo = useSelector(
    (state: RootState) => state.activeRoom.roomDetails?.block
  );

  const {
    sendMessage,
    messageInp,
    setMessageInp,
    openSendImageModal,
    setOpenSendImageModal,
  } = useSendMessage();

  const {
    handleOnRecordVoice,
    voiceRecordState,
    handleOnDeleteVoice,
    handleOnSendVoice,
    sendingVoice,
  } = useSendVoice();

  const isRecordingOrSendingVoice =
    voiceRecordState === "recording" || sendingVoice;

  return (
    <main>
      {!blockInfo?.isBlocked ? (
        <section className="lg:px-5 md:px-5 px-2 py-3 flex ">
          {/* Display Message form If not recording  */}
          {!(voiceRecordState === "recording") && !sendingVoice && (
            <form
              onSubmit={sendMessage}
              className="w-full flex flex-row lg:gap-x-4 md:gap-x-4 gap-x-2 items-center"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <button>
                    <BsEmojiSmile className="lg:text-[35px] md:text-[35px] text-[28px] cursor-pointer text-gray-700 dark:text-gray-300" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <EmojiPicker
                    theme={Theme.DARK}
                    onEmojiClick={({ emoji }) =>
                      setMessageInp((e: string) => e + emoji)
                    }
                  />
                </PopoverContent>
              </Popover>
              {/* Photos */}
              <IoMdPhotos
                className="text-[45px] cursor-pointer text-gray-700 dark:text-gray-300"
                onClick={() => setOpenSendImageModal(true)}
              />
              <Input
                placeholder="Type your message..."
                value={messageInp}
                onChange={(e) => setMessageInp(e.target.value)}
                className="text-[17px] h-10"
              />
              {messageInp ? (
                <button type="submit">
                  <BsFillSendFill className="lg:text-[30px] md:text-[30px] text-[24px] text-gray-400" />
                </button>
              ) : (
                <AiFillAudio
                  className="text-4xl cursor-pointer text-gray-700 dark:text-gray-300"
                  onClick={handleOnRecordVoice}
                />
              )}
            </form>
          )}
          {/* Voice Record Audio Waves */}
          {isRecordingOrSendingVoice && (
            <section className="min-w-full flex justify-between items-center gap-x-1 px-3 py-2 rounded-2xl bg-[#1e293b]">
              <section className="flex flex-row items-center gap-x-2">
                <button className="bg-black p-2 rounded-full">
                  <AiFillDelete
                    className="text-2xl text-white"
                    onClick={handleOnDeleteVoice}
                  />
                </button>
                <section className="flex flex-row gap-x-1">
                  <section className="text-white">Recording</section>
                  <section className="tracking-widest font-extrabold">
                    ...
                  </section>
                </section>
              </section>
              {!sendingVoice ? (
                <button
                  className="relative"
                  onClick={() => handleOnSendVoice()}
                >
                  <span className="animate-ping right-0 absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-75"></span>
                  <BsFillSendFill className="text-2xl text-white" />
                </button>
              ) : (
                <TailwindSpinner size={8} />
              )}
            </section>
          )}
        </section>
      ) : (
        <FooterIfChatRoomBlocked />
      )}

      {openSendImageModal && (
        <Dialog
          open={openSendImageModal}
          onOpenChange={() => setOpenSendImageModal(false)}
        >
          <SendImageModal />
        </Dialog>
      )}
    </main>
  );
};

export default ChatRoomFooter;

const FooterIfChatRoomBlocked = () => {
  const {
    handleOnUnblock,
    openUnblockModal,
    setOpenUnblockModal,
    blockingOper,
  } = useChat();
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const blockedByMe = activeRoom.roomDetails?.block?.blockedBy[currentUser.uid]
    ? true
    : false;

  const handleOnUnblockButton = async () => {
    await handleOnUnblock();
    setOpenUnblockModal(false);
  };

  return (
    <section className="lg:px-5 md:px-5 px-2 py-3 flex flex-row gap-x-0 items-center">
      {activeRoom.roomDetails?.block && !blockedByMe ? (
        <section>
          You cannot reply to this conversation.{" "}
          <AlertDialog open={openUnblockModal}>
            <AlertDialogTrigger>
              <span
                className="text-[17px] bg-clip-text cursor-pointer text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400"
                onClick={() => setOpenUnblockModal(true)}
              >
                Learn more
              </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <section>
                <AlertDialogHeader>
                  <AlertDialogDescription>
                    {activeRoom.chatWith?.displayName.split(" ")[0]} has blocked
                    you, you cannot engage in conversation until he unblocks
                    you.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-3">
                  <AlertDialogCancel onClick={() => setOpenUnblockModal(false)}>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </section>
            </AlertDialogContent>
          </AlertDialog>{" "}
        </section>
      ) : (
        <section>
          You cannot reply to this conversation.
          <AlertDialog open={openUnblockModal}>
            <AlertDialogTrigger>
              <span
                className="text-[17px] bg-clip-text cursor-pointer text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400"
                onClick={() => setOpenUnblockModal(true)}
              >
                Learn more
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
                  <Button
                    onClick={() => handleOnUnblockButton()}
                    disabled={blockingOper}
                  >
                    {blockingOper ? "Please wait..." : "Unblock"}
                  </Button>
                </AlertDialogFooter>
              </section>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      )}
    </section>
  );
};
