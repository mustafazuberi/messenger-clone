import Room from "./types.room";

type Friend = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  isActive: boolean;
  lastActive?: number;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  DOB?: Date;
  bio?: string;
};

export default Friend;

export type ChatUser = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  isActive: boolean;
  lastActive?: number;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  DOB?: Date;
  bio?: string;
  fromRoom: Room;
};
