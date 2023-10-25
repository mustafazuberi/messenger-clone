import Friend from "./type.friend";
import Message from "./types.message";
import UserNotification from "./types.notification";
import ChatRequest from "./types.request";
import User from "./types.user";

type Status = "idle" | "error" | "loading";

type UsersState = { status: Status; data: User[] };
type FriendsState = { status: Status; data: Friend[] };
type NotificationsState = { status: Status; data: UserNotification[] };

type ChatRequestsState = {
  requests: { status: Status; data: ChatRequest[] };
  sentRequests: { status: Status; data: ChatRequest[] };
  receivedRequests: { status: Status; data: ChatRequest[] };
};

type Room = {
  id: string;
  status: Status;
  messages: Message[];
  lastMessage: Message;
};

type RoomState = {
  activeRoom: Room;
  allRooms: Rooms;
  chatWih: Friend | null;
};

type Rooms = { [key: string]: Room };

export type {
  FriendsState,
  UsersState,
  ChatRequestsState,
  Status,
  NotificationsState,
  Room,
  Rooms,
  RoomState,
};
