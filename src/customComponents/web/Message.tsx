import { useSelector } from "react-redux";
import { RootState } from "@/store";
import getFormattedTime from "@/services/getFormattedTime";
import Message from "@/types/types.message";
import { RiArrowDownSLine } from "react-icons/ri";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSendMessage from "@/hooks/useSendMessage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ForwardMessageModal from "./ForwardMessageModal";
import useChat from "@/hooks/useChat";

const Message = ({
  msg,
  activeRoomMessages,
}: {
  msg: Message;
  activeRoomMessages: Message[];
}) => {
  const {
    openImageModal,
    setOpenImageModal,
    openForwardMessageModal,
    setOpenForwardMessageModal,
  } = useSendMessage();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const byMe = msg.senderId === currentUser.uid ? true : false;
  return (
    <>
      <section
        className={`w-full flex items-center ${
          byMe ? "justify-end" : "justify-start"
        }`}
      >
        <section
          className={`${
            byMe ? "bg-[#005c4b]" : "bg-[#1e293b]"
          } max-w-[70%] px-2 py-2 rounded-[6px] rounded-tr-none`}
        >
          {msg.text && (
            <section className="flex flex-col">
              <section className="flex flex-row justify-end">
                <MessageDropDown
                  message={msg}
                  setOpenForwardMessageModal={setOpenForwardMessageModal}
                  updatedLastMessage={
                    activeRoomMessages[activeRoomMessages.length - 2]
                  }
                />
              </section>
              <section className="flex flex-row justify-between gap-x-3">
                <section className="text-[15px] font-extralight">
                  {msg.text}
                </section>
                <section className="flex flex-row justify-between items-end gap-x-1">
                  <section className="text-[9px] font-extralight flex items-end">
                    {getFormattedTime(msg.date)}
                  </section>
                  {byMe && (
                    <section className="relative mb-1">
                      <TwoCheck seen={msg.seen} />
                    </section>
                  )}
                </section>
              </section>
            </section>
          )}

          {msg.img && (
            <section className="relative">
              <section className="flex flex-row justify-end pb-2">
                <MessageDropDown
                  message={msg}
                  setOpenForwardMessageModal={setOpenForwardMessageModal}
                />
              </section>
              <Image
                src={msg.img}
                width={100}
                height={100}
                alt="Chat room image"
                loading="eager"
                className="w-96 h-96 blur-[2px]"
              />
              {byMe && (
                <section className="flex flex-row justify-between items-end gap-x-1">
                  <section className="text-[9px] font-extralight flex items-end">
                    {getFormattedTime(msg.date)}
                  </section>
                  {byMe && (
                    <section className="relative mb-1">
                      <TwoCheck seen={msg.seen} />
                    </section>
                  )}
                </section>
              )}
              <Button
                className="absolute top-40 text-black left-32 bg-gray-300"
                onClick={() =>
                  setOpenImageModal({
                    img: msg.img ? msg.img : "null",
                    open: true,
                  })
                }
              >
                Open Image
              </Button>
            </section>
          )}
        </section>
        {openImageModal.open && (
          <Dialog
            open={openImageModal.open}
            onOpenChange={() => setOpenImageModal({ img: "", open: false })}
          >
            <DialogContent className="min-h-[200px] ">
              <section className="w-full mt-4 max-h-[400px] overflow-auto overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit">
                <img src={openImageModal.img} className="h-auto" />
              </section>
            </DialogContent>
          </Dialog>
        )}
      </section>
      {/* Forward Message Modal */}
      <Dialog
        open={openForwardMessageModal.open}
        onOpenChange={() =>
          setOpenForwardMessageModal({ open: false, message: null })
        }
      >
        <DialogContent>
          <ForwardMessageModal message={openForwardMessageModal.message} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Message;

const TwoCheck = ({ seen }: { seen: boolean }) => {
  return (
    <section className="flex flex-col justify-end items-end">
      <IoCheckmarkDoneSharp
        className={`${
          seen ? "text-[#2c90a0]" : "text-gray-300"
        } relative font-extrabold top-1`}
      />
    </section>
  );
};

const MessageDropDown: React.FC<{
  message: Message;
  setOpenForwardMessageModal: (value: {
    open: boolean;
    message: Message;
  }) => void;
  updatedLastMessage?: Message;
}> = ({ message, setOpenForwardMessageModal, updatedLastMessage }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const { handleOnUnsendMessage } = useSendMessage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <RiArrowDownSLine className="text-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="py-2 cursor-pointer"
          onClick={() =>
            setOpenForwardMessageModal({
              open: true,
              message: message,
            })
          }
        >
          Forward
        </DropdownMenuItem>
        {message.senderId === currentUser.uid && (
          <DropdownMenuItem
            onClick={() =>
              handleOnUnsendMessage({
                msg: message,
                updatedLastMessage: updatedLastMessage,
              })
            }
            className="py-2 cursor-pointer"
          >
            Unsend
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
