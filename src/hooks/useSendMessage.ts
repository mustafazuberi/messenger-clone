import { useToast } from "@/components/ui/use-toast";
import { db } from "@/db/firebase.config";
import createImageUrl from "@/services/createImageUrl";
import { RootState } from "@/store";
import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import Room from "@/types/types.room";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { TbRuler3 } from "react-icons/tb";
import { useSelector } from "react-redux";

const useSendMessage = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const rooms = useSelector((state: RootState) => state.rooms);
  const { toast } = useToast();
  const [findFriendInp, setFindFriendInp] = React.useState<string>("");
  const [messageInp, setMessageInp] = React.useState<string>("");
  const [openSendImageModal, setOpenSendImageModal] = useState(false);
  const [sendImageFile, setSendImageFile] = useState<File | null>();
  const [sendImageLoading, setSendImageLoading] = useState<boolean>(false);
  const [sendImageUrl, setSendImageUrl] = useState<string>("");
  const [sendingImage, setSendingImage] = useState<boolean>(false);
  const [openImageModal, setOpenImageModal] = useState<{
    img: string;
    open: boolean;
  }>({
    img: "",
    open: false,
  });
  const [openForwardMessageModal, setOpenForwardMessageModal] = useState<{
    message: Message | null;
    open: boolean;
  }>({ message: null, open: false });
  const [forwarding, setForwarding] = useState<{
    forwarding: boolean;
    to: Friend | null;
  }>({ forwarding: false, to: null });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (e) => {
      setSendImageFile(e[0]);
      setSendImageLoading(true);
      const imageUrl = await createImageUrl(e[0]);
      setSendImageUrl(imageUrl);
      setSendImageLoading(false);
    },
  });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const message: Message = {
      date: Date.now(),
      seen: false,
      senderId: currentUser.uid,
      text: messageInp,
      delivered: false,
    };
    setMessageInp("");
    await addDoc(
      collection(db, "chatrooms", activeRoom?.roomDetails?.id!, "messages"),
      message
    );
    // updating last message
    await updateDoc(doc(db, "chatrooms", activeRoom?.roomDetails?.id!), {
      lastMessage: message,
      lastConversation: Date.now(),
    });
  };

  const handleSendImage = async () => {
    try {
      setSendingImage(true);
      const message: Message = {
        date: Date.now(),
        seen: false,
        senderId: currentUser.uid,
        img: sendImageUrl,
        delivered: false,
      };
      await addDoc(
        collection(db, "chatrooms", activeRoom?.roomDetails?.id!, "messages"),
        message
      );
      // updating last message
      await updateDoc(doc(db, "chatrooms", activeRoom?.roomDetails?.id!), {
        lastMessage: message,
        lastConversation: Date.now(),
      });
      setSendingImage(false);
      setOpenSendImageModal(false);
      setSendImageFile(null);
      toast({
        description: "Image Sent!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnUnsendMessage = async (msg: Message) => {
    await deleteDoc(
      doc(db, "chatrooms", activeRoom.roomDetails?.id!, "messages", msg.id!)
    );
    toast({
      description: "Message unsent!",
    });
  };

  const handleForwardMessage = async ({
    msg,
    forwardTo,
  }: {
    msg: Message;
    forwardTo: Friend;
  }) => {
    const message: Message = {
      date: Date.now(),
      seen: false,
      senderId: currentUser.uid,
      text: msg.text,
      delivered: false,
    };
    const room: Room | null =
      rooms.find(
        (room: Room) => room.users[currentUser.uid] && room.users[forwardTo.uid]
      ) || null;

    if (!room) return;
    try {
      setForwarding({ forwarding: true, to: forwardTo });
      await addDoc(collection(db, "chatrooms", room.id!, "messages"), message);
      await updateDoc(doc(db, "chatrooms", room.id!), {
        lastMessage: message,
        lastConversation: Date.now(),
      });
      toast({
        description: `${msg.img ? "Image" : "Message"} forwared to ${
          forwardTo.displayName
        }`,
      });
      setForwarding({ forwarding: false, to: null });
    } catch (error) {
      console.log(error);
      setForwarding({ forwarding: false, to: null });
    }
  };

  return {
    sendMessage,
    messageInp,
    setMessageInp,
    getRootProps,
    getInputProps,
    sendImageFile,
    sendImageLoading,
    sendImageUrl,
    handleSendImage,
    sendingImage,
    openSendImageModal,
    setOpenSendImageModal,
    openImageModal,
    setOpenImageModal,
    handleOnUnsendMessage,
    findFriendInp,
    setFindFriendInp,
    openForwardMessageModal,
    setOpenForwardMessageModal,
    handleForwardMessage,
    forwarding,
  };
};

export default useSendMessage;
