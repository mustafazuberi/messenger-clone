import React, { useCallback } from "react";
import { VoiceRecordState } from "@/types/types.miscellaneous";
import Recorder from "recorder-js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/db/firebase.config";
import Message from "@/types/types.message";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

const useSendVoice = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const activeRoom = useSelector((state: RootState) => state.activeRoom);

  const [voiceRecordState, setVoiceRecordState] =
    React.useState<VoiceRecordState>("record");
  const [recorder, setRecorder] = React.useState<Recorder | null>(null);
  const [audioStream, setAudioStream] = React.useState<MediaStream | null>(
    null
  );
  const [sendingVoice, setSendingVoice] = React.useState<boolean>(false);

  const handleOnRecordVoice = useCallback(async () => {
    setVoiceRecordState("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const newRecorder = new Recorder(audioContext);

      newRecorder.init(stream);
      setRecorder(newRecorder);
      setAudioStream(stream);
      await newRecorder.start();
      setVoiceRecordState("recording");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setVoiceRecordState("record");
    }
  }, []);

  const handleOnSendVoice = useCallback(async () => {
    setSendingVoice(true);
    try {
      if (!recorder) return;
      const { blob } = await recorder.stop();
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      setVoiceRecordState("recorded");
      if (!blob) return;
      const audioFileUrl = await uploadToFirebaseStorageAndGetUrl(blob);

      if (!audioFileUrl) return;
      const message: Message = {
        date: Date.now(),
        seen: false,
        senderId: currentUser.uid,
        voice: audioFileUrl,
        delivered: false,
        type: "voice",
      };
      const msgDoc = await addDoc(
        collection(db, "chatrooms", activeRoom?.roomDetails?.id!, "messages"),
        message
      );

      await updateDoc(doc(db, "chatrooms", activeRoom?.roomDetails?.id!), {
        lastMessage: { ...message, id: msgDoc.id },
        lastConversation: Date.now(),
      });

      setSendingVoice(false);
      setVoiceRecordState("record");
      setRecorder(null);
      setAudioStream(null);
    } catch (error) {
      setSendingVoice(false);
      console.log("Error at handleOnSendVoice : ", error);
    }
  }, [recorder, audioStream, currentUser, activeRoom]);

  const uploadToFirebaseStorageAndGetUrl = useCallback(
    async (blob: Blob): Promise<string | null> => {
      try {
        const storageRef = ref(storage, `audio/${Date.now()}-audio-file.wav`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading to Firebase Storage:", error);
        return null;
      }
    },
    []
  );

  const handleOnDeleteVoice = useCallback(() => {
    setVoiceRecordState("record");
    setRecorder(null);
    setAudioStream(null);
  }, []);

  return {
    voiceRecordState,
    setVoiceRecordState,
    handleOnRecordVoice,
    handleOnSendVoice,
    handleOnDeleteVoice,
    sendingVoice,
  };
};

export default useSendVoice;
