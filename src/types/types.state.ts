import Friend from "./type.friend";
import ChatRequest from "./types.request";
import Stranger from "./types.stranger";
import User from "./types.user";

type Status = "idle" | "error" | "loading";

type UsersState = { status: Status; data: User[] };
type StrangersState = { status: Status; data: Stranger[] };
type FriendsState = { status: Status; data: Friend[] };
type ChatRequestsState = { status: Status; data: ChatRequest[] };
type ReceivedRequestsState = { status: Status; data: ChatRequest[] };
type SentRequestsState = { status: Status; data: ChatRequest[] };

export type {
  StrangersState,
  FriendsState,
  UsersState,
  ChatRequestsState,
  ReceivedRequestsState,
  SentRequestsState
};
