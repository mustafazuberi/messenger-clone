import ChatRequest from "@/types/types.request";
import {
  FriendsState,
  ChatRequestsState,
  StrangersState,
  UsersState,
} from "@/types/types.state";
import User from "@/types/types.user";

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

export const USER_INITIAL_STATE: User = {
  email: "",
  uid: "",
  displayName: "",
  emailVerified: false,
  gender: "",
  photoUrl: "",
};

export const USERS_INITIAL_STATE: UsersState = {
  status: STATUSES.LOADING,
  data: [],
};

export const FRIENDS_INITIAL_STATE: FriendsState = {
  status: STATUSES.LOADING,
  data: [],
};

export const STRANGERS_INITIAL_STATE: StrangersState = {
  status: STATUSES.LOADING,
  data: [],
};

export const NOTIFICATIONS_INITIAL_STATE: ChatRequestsState = {
  status: STATUSES.LOADING,
  data: [],
};
