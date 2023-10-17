import Friend from "./type.friend";
import ChatRequest from "./types.request";
import User from "./types.user";

type Status = "idle" | "error" | "loading";

type UsersState = { status: Status; data: User[] };
type FriendsState = { status: Status; data: Friend[] };

type ChatRequestsState = {
  requests: { status: Status; data: ChatRequest[] };
  sentRequests: { status: Status; data: ChatRequest[] };
  receivedRequests: { status: Status; data: ChatRequest[] };
};

export type { FriendsState, UsersState, ChatRequestsState, Status };
