import Friend from "./type.friend";
import Stranger from "./types.stranger";
import User from "./types.user";

type Status = "idle" | "error" | "loading";

type UsersState = { status: Status; data: User[] };
type StrangersState = { status: Status; data: Stranger[] };
type FriendsState = { status: Status; data: Friend[] };

export type { StrangersState, FriendsState, UsersState };
