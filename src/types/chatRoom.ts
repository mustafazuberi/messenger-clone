import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import Room from "@/types/types.room";
import { Status } from "@/types/types.state";
import { Call } from "./types.call";

export type ActiveRoom = {
  chatWith: Friend | null;
  roomDetails: Room | null;
  messages: ActiveRoomMessages;
};

export type ActiveRoomMessages = {
  data: { [x: string]: Message[] } | null;
  status: Status;
};

export type CallsState = {
  calls: Call[];
  activeCall: Call | null;
};
