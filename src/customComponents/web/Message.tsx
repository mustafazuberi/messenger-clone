import { useSelector } from "react-redux";
import { RootState } from "@/store";
import getFormattedTime from "@/services/getFormattedTime";
import Message from "@/types/types.message";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSendMessage from "@/hooks/useSendMessage";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ForwardMessageModal from "./ForwardMessageModal";
import MessageDropDown from "./MessageDropdown";
import Friend from "@/types/type.friend";
import UserImageAvatar from "./UserImageAvatar";
import useChat from "@/hooks/useChat";
import useReq from "@/hooks/useReq";
import React from "react";

const Message: React.FC<{ msg: Message }> = React.memo(({ msg }) => {
  const {
    openImageModal,
    setOpenImageModal,
    openForwardMessageModal,
    setOpenForwardMessageModal,
  } = useSendMessage();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const byMe = msg.senderId === currentUser.uid ? true : false;

  return (
    <section>
      <section
        className={`w-full flex items-center ${
          byMe ? "justify-end" : "justify-start"
        }`}
      >
        <section
          className={`${
            byMe ? "bg-[#3b82f6]" : "bg-[#1e293b]"
          } lg:max-w-[70%] md:max-w-[70%] max-w-[90%] px-2 py-2 text-white`}
        >
          <section className="flex flex-col">
            <section className="flex flex-row justify-end">
              <MessageDropDown
                message={msg}
                setOpenForwardMessageModal={setOpenForwardMessageModal}
              />
            </section>
            <section
              className={`flex flex-${
                msg.text ? "row" : "col"
              } lg:gap-3 md:gap-3 gap-2`}
            >
              {msg.text ? (
                <section className="text-[15px] font-extralight">
                  {msg.text}
                </section>
              ) : msg.img ? (
                <section>
                  <section className="relative mt-2">
                    <Image
                      src={msg.img}
                      width={100}
                      height={100}
                      alt="Chat room image"
                      loading="eager"
                      className="sm:w-96 w-56 sm:h-96 h-56 blur-[2px]"
                    />
                    <section className="flex justify-center w-full absolute top-24 ">
                      <Button
                        className="bg-gray-300 text-black"
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
                  </section>
                </section>
              ) : msg.friend ? (
                <SharedFriend friend={msg.friend} />
              ) : (
                msg.voice && <MsgAudioPlay msg={msg} />
              )}
              <section className="flex flex-row justify-between items-end gap-x-1">
                <section className="text-[9px] font-extralight flex items-end">
                  {getFormattedTime(msg.date)}
                </section>
                {byMe && (
                  <section className="text-[12px] font-light">
                    {msg.seen ? "seen" : "sent"}
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
          {openImageModal.img && (
            <section className="w-full mt-4 max-h-[400px] overflow-auto overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit">
              <img src={openImageModal.img} className="h-auto" />
            </section>
          )}
        </DialogContent>
      </Dialog>
      {/* Forward Message Modal */}
      {openForwardMessageModal.open && (
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
      )}
    </section>
  );
});

export default Message;

const SharedFriend: React.FC<{ friend: Friend }> = React.memo(({ friend }) => {
  const { handleOnChatUser } = useChat();
  const { unsendChatRequest, confirmChatRequest, sendChatRequest } = useReq();

  const currentUser = useSelector((state: RootState) => state.currentUser);
  const friends = useSelector((state: RootState) => state.friends);
  const requests = useSelector((state: RootState) => state.chatRequests);

  const isFriend = friends.data.find((f) => f.uid === friend.uid);
  const isReqReceived = requests.receivedRequests.data.find(
    (recReq) => recReq.senderId === friend.uid
  );
  const isReqSent = requests.sentRequests.data.find(
    (recReq) => recReq.receiverId === friend.uid
  );

  return (
    <section className="flex flex-col gap-y-2 px-3">
      <section className="flex flex-row gap-x-2 items-center lg:min-w-[300px] md:min-w-[300px] max-w-[70%]">
        <section>
          <UserImageAvatar user={friend} size={10} />
        </section>
        <section className="flex flex-col">
          <span>{friend.displayName}</span>
          <span>{friend.email.slice(0, 26)}</span>
        </section>
      </section>
      <section className="flex justify-center">
        {isFriend && (
          <Button
            className="w-full text-black dark:text-black dark:bg-white dark:hover:bg-white"
            variant={"outline"}
            onClick={() => handleOnChatUser(friend)}
          >
            Message
          </Button>
        )}
        {isReqReceived && (
          <Button
            className="w-full text-black"
            variant={"outline"}
            onClick={() => confirmChatRequest(isReqReceived)}
          >
            Confirm
          </Button>
        )}
        {isReqSent && (
          <Button
            className="w-full text-black"
            variant={"outline"}
            onClick={() => unsendChatRequest(isReqSent)}
          >
            Unsent
          </Button>
        )}
        {friend.uid === currentUser.uid && (
          <Button className="w-full text-black" variant={"outline"}>
            You
          </Button>
        )}
        {!isReqSent &&
          !isFriend &&
          !isReqReceived &&
          !(friend.uid === currentUser.uid) && (
            <Button
              className="w-full"
              variant={"default"}
              onClick={() =>
                sendChatRequest({ receiver: friend, sender: currentUser })
              }
            >
              Add
            </Button>
          )}
      </section>
    </section>
  );
});

const MsgAudioPlay = ({ msg }: { msg: Message }) => {
  if (!msg.voice) return;

  return (
    <section className="flex">
      <audio className="max-w-full" controls>
        <source src={msg.voice} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </section>
  );
};
