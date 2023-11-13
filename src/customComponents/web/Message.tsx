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
import Friend from "@/types/type.friend";
import UserImageAvatar from "./UserImageAvatar";
import useChat from "@/hooks/useChat";
import useReq from "@/hooks/useReq";

type props = {
  msg: Message;
};

const Message = ({ msg }: props) => {
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
            byMe ? "bg-[#005c4b]" : "bg-[#1e293b]"
          } sm:max-w-[70%] max-w-[90%] px-2 py-2 rounded-2xl text-white `}
        >
          <section className="flex flex-col">
            <section className="flex flex-row justify-end">
              <MessageDropDown
                message={msg}
                setOpenForwardMessageModal={setOpenForwardMessageModal}
              />
            </section>
            <section
              className={`flex flex-${msg.text ? "row" : "col"} sm:gap-3 gap-2`}
            >
              {msg.text ? (
                <section className="text-[15px] font-extralight">
                  {msg.text}
                </section>
              ) : msg.img ? (
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
              ) : (
                msg.friend && <SharedFriend friend={msg.friend} />
              )}
              <section className="flex flex-row justify-between items-end gap-x-1">
                <section className="text-[9px] font-extralight flex items-end">
                  {getFormattedTime(msg.date)}
                </section>
                {byMe && (
                  <section className="text-[9px]">
                    {/* <TwoCheck seen={} /> */}
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

const SharedFriend = ({ friend }: { friend: Friend }) => {
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
      <section className="flex flex-row gap-x-2 items-center">
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
            className="w-full"
            variant={"default"}
            onClick={() => handleOnChatUser(friend)}
          >
            Message
          </Button>
        )}
        {isReqReceived && (
          <Button
            className="w-full"
            variant={"default"}
            onClick={() => confirmChatRequest(isReqReceived)}
          >
            Confirm
          </Button>
        )}
        {isReqSent && (
          <Button
            className="w-full"
            variant={"default"}
            onClick={() => unsendChatRequest(isReqSent)}
          >
            Unsent
          </Button>
        )}
        {friend.uid === currentUser.uid && (
          <Button className="w-full" variant={"default"}>
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
};
