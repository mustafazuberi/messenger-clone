import Friend from "./type.friend";
import Message from "./types.message";
import Room from "./types.room";
import User from "./types.user";

export type SendChatReqParam = {
  sender: User;
  receiver: User;
};

export type SendNotificationParam = {
  type: "Request Accepted" | "Request Received";
  to: User;
  by: User;
};

export type OnlineInfo = {
  isActive: boolean;
  lastActive: number;
};

export type ForwardMessageModal = {
  message: Message | null;
  open: boolean;
};

export type Forwarding = {
  forwarding: boolean;
  to: Friend | null;
};

export type OnForwardMessage = {
  msg: Message;
  forwardTo: Friend;
};

export type OpenImageModal = {
  img: string;
  open: boolean;
};

export type VoiceRecordState = "record" | "recording" | "recorded";

export type ActiveTab = "sentRequests" | "receivedRequests";

export type ChatUserProps = {
  friend: Friend;
  room: Room;
  roomsUnseenMessages: { [x: string]: Message[] };
};

export type CallDialogProps = {
  callType: "audio call" | "video call";
  callTo: User;
  calledBy: User;
  room: Room;
  callStatus: "connecting" | "connected";
  open: boolean;
};
