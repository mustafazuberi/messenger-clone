import User from "./types.user";

export const CALL_STATUS = Object.freeze({
  CALLING: "calling",
  ONGOING: "ongoing",
  MISSED: "missed",
  DONE: "done",
  CANCELLED: "cancelled",
});

export const CALL_TYPE = Object.freeze({
  AUDIO: "audio call",
  VIDEO: "video call",
});

export type Call = {
  id?: string;
  to: string;
  from: string;
  toUser: User;
  fromUser: User;
  callStatus: (typeof CALL_STATUS)[keyof typeof CALL_STATUS];
  type: (typeof CALL_TYPE)[keyof typeof CALL_TYPE];
  answered: boolean;
  isActive: boolean;
  createdAt: number;
  callTime?: { started: number; ended: number };
  offer?: {
    sdp: string;
    type: RTCSdpType;
  };
  answer?: {
    sdp: string;
    type: RTCSdpType;
  };
};
