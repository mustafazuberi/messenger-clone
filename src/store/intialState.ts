import Friend from "@/types/type.friend";
import Stranger from "@/types/types.stranger";
import User from "@/types/types.user";

export const USER_INITIAL_STATE: User = {
  email: "",
  uid: "",
  displayName: "",
  emailVerified: false,
  gender: "",
  photoUrl: "",
};

export const USERS_INITIAL_STATE: User[] = [];

export const FRIENDS_INITIAL_STATE: Friend[] = [];

export const STRANGERS_INITIAL_STATE: Stranger[] = [];
