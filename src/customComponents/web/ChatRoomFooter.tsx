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

const ChatRoomFooter = () => {
  const {
    sendMessage,
    messageInp,
    setMessageInp,
    openSendImageModal,
    setOpenSendImageModal,
  } = useSendMessage();

  const { handleOnRecordVoice, voiceRecordState, setVoiceRecordState } =
    useSendVoice();

  return (
    <main>
      <section className="sm:px-5 px-2 py-3 flex ">
        {/* Display Message form If not recording  */}
        {!(voiceRecordState === "recording") && (
          <form
            onSubmit={sendMessage}
            className="w-full flex flex-row sm:gap-x-4 gap-x-2 items-center"
          >
            <Popover>
              <PopoverTrigger asChild>
                <button>
                  <BsEmojiSmile className="sm:text-[35px] text-[28px] cursor-pointer text-gray-400" />
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
              className="text-[45px] cursor-pointer text-gray-400"
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
                <BsFillSendFill className="sm:text-[30px] text-[24px] text-gray-400" />
              </button>
            ) : (
              <AiFillAudio
                className="text-4xl cursor-pointer text-gray-400"
                onClick={handleOnRecordVoice}
              />
            )}
          </form>
        )}
        {/* Voice Record Audio Waves */}
        {voiceRecordState === "recording" && (
          <section className="min-w-full flex justify-between items-center gap-x-1 px-3 py-2 rounded-2xl bg-[#1e293b]">
            <section className="flex flex-row items-center gap-x-2">
              <button
                className="bg-black p-2 rounded-full"
                onClick={() => setVoiceRecordState("record")}
              >
                <AiFillDelete className="text-2xl text-white" />
              </button>
              <section className="flex flex-row gap-x-1">
                <section className="text-white">Recording</section>
                <section className="tracking-widest font-extrabold">
                  ...
                </section>
              </section>
            </section>
            <button type="submit" className="relative">
              <span className="animate-ping right-0 absolute inline-flex h-6 w-6 rounded-full bg-sky-400 opacity-75"></span>
              <BsFillSendFill className="text-2xl text-white" />
            </button>
          </section>
        )}
      </section>

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
