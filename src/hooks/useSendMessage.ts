import { useToast } from "@/components/ui/use-toast";
import { db } from "@/db/firebase.config";
import createImageUrl from "@/services/createImageUrl";
import { RootState } from "@/store";
import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import {
  ForwardMessageModal,
  Forwarding,
  OnForwardMessage,
  OpenImageModal,
} from "@/types/types.miscellaneous";
import Room from "@/types/types.room";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import useChat from "./useChat";

const openImageModalInitialState: OpenImageModal = {
  img: "",
  open: false,
};

const forwardingInitialState: Forwarding = {
  forwarding: false,
  to: null,
};

const useSendMessage = () => {
  const { toast } = useToast();
  const { handleOnChatUser } = useChat();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);
  const rooms = useSelector((state: RootState) => state.rooms);
  const [findFriendInp, setFindFriendInp] = React.useState<string>("");
  const [messageInp, setMessageInp] = React.useState<string>("");
  const [openSendImageModal, setOpenSendImageModal] = useState(false);
  const [sendImageFile, setSendImageFile] = useState<File | null>();
  const [sendImageLoading, setSendImageLoading] = useState<boolean>(false);
  const [sendImageUrl, setSendImageUrl] = useState<string>("");
  const [sendingImage, setSendingImage] = useState<boolean>(false);
  const [openImageModal, setOpenImageModal] = useState<OpenImageModal>(
    openImageModalInitialState
  );
  const [openForwardMessageModal, setOpenForwardMessageModal] =
    useState<ForwardMessageModal>({ message: null, open: false });
  const [forwarding, setForwarding] = useState<Forwarding>(
    forwardingInitialState
  );
  // This states for sharing friend from chatroom info side bar
  const [shareWithInp, setShareWithInp] = useState("");
  // when share function call will set that sharing with friend id in state also this will help to show loading on specfiic user we were sharing friend with
  const [sharingWith, setSharingWith] = useState<string | false>(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (e) => {
      setSendImageFile(e[0]);
      setSendImageLoading(true);
      const imageUrl = await createImageUrl(e[0]);
      setSendImageUrl(imageUrl);
      setSendImageLoading(false);
    },
  });

  const sendMessage = useCallback(
    async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        if (!messageInp) return;
        const message: Message = {
          date: Date.now(),
          seen: false,
          senderId: currentUser.uid,
          text: messageInp,
          delivered: false,
          type: "text",
        };
        setMessageInp("");
        const msgDoc = await addDoc(
          collection(db, "chatrooms", activeRoom?.roomDetails?.id!, "messages"),
          message
        );
        // updating last message
        await updateDoc(doc(db, "chatrooms", activeRoom?.roomDetails?.id!), {
          lastMessage: { ...message, id: msgDoc.id },
          lastConversation: Date.now(),
        });
      } catch (error) {
        console.log("Error in sendMessage", error);
      }
    },
    [messageInp, setMessageInp, currentUser, activeRoom]
  );

  const handleSendImage = useCallback(async () => {
    try {
      setSendingImage(true);
      const message: Message = {
        date: Date.now(),
        seen: false,
        senderId: currentUser.uid,
        img: sendImageUrl,
        delivered: false,
        type: "image",
      };
      const msgDoc = await addDoc(
        collection(db, "chatrooms", activeRoom?.roomDetails?.id!, "messages"),
        message
      );
      // updating last message
      await updateDoc(doc(db, "chatrooms", activeRoom?.roomDetails?.id!), {
        lastMessage: { ...message, id: msgDoc.id },
        lastConversation: Date.now(),
      });

      setSendingImage(false);
      setOpenSendImageModal(false);
      setSendImageFile(null);
      toast({
        description: "Image Sent!",
      });
    } catch (error) {
      console.log("error in handleSendImage", error);
    }
  }, [
    setSendingImage,
    setOpenSendImageModal,
    setSendImageFile,
    sendImageUrl,
    currentUser,
    activeRoom,
    toast,
  ]);

  const handleForwardMessage = useCallback(
    async ({ msg, forwardTo }: OnForwardMessage) => {
      const message: Message = {
        date: Date.now(),
        seen: false,
        senderId: currentUser.uid,
        text: msg.text,
        delivered: false,
        type: msg.type,
      };
      const room: Room | null =
        rooms.find(
          (room: Room) =>
            room.users[currentUser.uid] && room.users[forwardTo.uid]
        ) || null;

      if (!room) return;
      try {
        setForwarding({ forwarding: true, to: forwardTo });
        await addDoc(
          collection(db, "chatrooms", room.id!, "messages"),
          message
        );
        await updateDoc(doc(db, "chatrooms", room.id!), {
          lastMessage: message,
          lastConversation: Date.now(),
        });
        toast({
          description: `${msg.img ? "Image" : "Message"} forwared to ${
            forwardTo.displayName
          }`,
        });
        setForwarding(forwardingInitialState);
        handleOnChatUser(forwardTo);
      } catch (error) {
        console.log(error);
        setForwarding(forwardingInitialState);
      }
    },
    [currentUser, rooms, setForwarding, toast]
  );

  const handleOnShareFriend = useCallback(
    async (friend: Friend) => {
      try {
        const message: Message = {
          date: Date.now(),
          seen: false,
          senderId: currentUser.uid,
          friend: activeRoom.chatWith!,
          delivered: false,
          type: "friend",
        };
        const room: Room | null =
          rooms.find(
            (room: Room) =>
              room.users[currentUser.uid] && room.users[friend.uid]
          ) || null;

        if (!room) return;
        setSharingWith(friend.uid);
        const msgDoc = await addDoc(
          collection(db, "chatrooms", room.id!, "messages"),
          message
        );
        // updating last message
        await updateDoc(doc(db, "chatrooms", room.id!), {
          lastMessage: { ...message, id: msgDoc.id },
          lastConversation: Date.now(),
        });
        setSharingWith(false);
        toast({
          description: "Shared!",
        });
      } catch (error) {
        console.log(error);
        setSharingWith(false);
      }
    },
    [currentUser, activeRoom, rooms, setSharingWith, toast]
  );

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
    findFriendInp,
    setFindFriendInp,
    openForwardMessageModal,
    setOpenForwardMessageModal,
    handleForwardMessage,
    forwarding,
    shareWithInp,
    setShareWithInp,
    sharingWith,
    handleOnShareFriend,
  };
};

export default useSendMessage;
