import User from "@/types/types.user";
import { STATUSES } from "./slice/allUsersSlice";

export const USER_INITIAL_STATE: User = {
  email: "",
  password: "",
  uid: "",
  displayName: "",
  emailVerified: false,
  friends: [],
  gender: "",
  photoUrl: "",
};
