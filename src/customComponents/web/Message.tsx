import { useSelector } from "react-redux";
import { RootState } from "@/store";
import getFormattedTime from "@/services/getFormattedTime";
import Message from "@/types/types.message";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSendMessage from "@/hooks/useSendMessage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ForwardMessageModal from "./ForwardMessageModal";
import { TwoCheck } from "./CheckMarks";
import MessageDropDown from "./MessageDropdown";

type props = {
  msg: Message;
  activeRoomMessages: Message[];
};

const Message = ({ msg, activeRoomMessages }: props) => {
  const {
    openImageModal,
    setOpenImageModal,
    openForwardMessageModal,
    setOpenForwardMessageModal,
  } = useSendMessage();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const byMe = msg.senderId === currentUser.uid ? true : false;
  const lastMsg = activeRoomMessages[activeRoomMessages.length - 2];
  return (
    <section>
      <section
        className={`w-full flex items-center ${
          byMe ? "justify-end" : "justify-start"
        }`}
      >
        <section
          className={`${
            byMe ? "bg-[#005c4b]" : "bg-[#1e293b]"
          } max-w-[70%] px-2 py-2 rounded-[12px] rounded-tr-none text-white `}
        >
          <section className="flex flex-col">
            <section className="flex flex-row justify-end">
              <MessageDropDown
                message={msg}
                setOpenForwardMessageModal={setOpenForwardMessageModal}
                updatedLastMessage={lastMsg} //This will update if user will unsend last message
              />
            </section>
            <section className={`flex flex-${msg.text ? "row" : "col"} gap-3`}>
              {msg.text ? (
                <section className="text-[15px] font-extralight">
                  {msg.text}
                </section>
              ) : (
                msg.img && (
                  <section className="relative mt-2">
                    <Image
                      src={msg.img}
                      width={100}
                      height={100}
                      alt="Chat room image"
                      loading="eager"
                      className="w-96 h-96 blur-[2px]"
                    />
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
                )
              )}
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
        </section>
      </section>

      {/* Send Image Modal */}
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
    </section>
  );
};

export default Message;
