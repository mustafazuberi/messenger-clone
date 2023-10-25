import Friend from "./type.friend";
import Message from "./types.message";
import UserNotification from "./types.notification";
import ChatRequest from "./types.request";
import Room from "./types.room";
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

type RoomsState = Room[];

type RoomsMessages = { [key: string]: Message[] };

export type {
  FriendsState,
  UsersState,
  ChatRequestsState,
  Status,
  NotificationsState,
  RoomsState,
  RoomsMessages
};
