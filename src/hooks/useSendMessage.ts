import { useToast } from "@/components/ui/use-toast";
import { db } from "@/db/firebase.config";
import createImageUrl from "@/services/createImageUrl";
import { RootState } from "@/store";
import Message from "@/types/types.message";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";

const useSendMessage = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const { toast } = useToast();
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
  };
};

export default useSendMessage;
