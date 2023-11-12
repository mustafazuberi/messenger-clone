import { VoiceRecordState } from "@/types/types.miscellaneous";
import React from "react";

const VOICE_RECORD_STATES = Object.freeze({
  RECORD: "record",
  RECORDING: "recording",
  RECORDED: "recorded",
});

const useSendVoice = () => {
  const [voiceRecordState, setVoiceRecordState] =
    React.useState<VoiceRecordState>(VOICE_RECORD_STATES.RECORD);

  const handleOnRecordVoice = () => {
    setVoiceRecordState(VOICE_RECORD_STATES.RECORDING);
  };

  return { voiceRecordState, setVoiceRecordState, handleOnRecordVoice };
};

export default useSendVoice;
