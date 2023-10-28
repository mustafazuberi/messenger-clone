import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import Room from "@/types/types.room";
import { Status } from "@/types/types.state";

export type ActiveRoom = {
  chatWith: Friend;
  roomDetails: Room;
};

export type ActiveRoomMessages = {
  data: Message[];
  status: Status;
};
