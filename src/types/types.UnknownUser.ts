import ChatRequest from "./types.request";
export type reqStatusObj = {
  ALREADY_RECIEVED: "AlreadyReceived";
  ALREADY_SENT: "AlreadySent";
  UNKNOWN: "Unknown";
};

export const reqStatusObj: reqStatusObj = {
  ALREADY_RECIEVED: "AlreadyReceived",
  ALREADY_SENT: "AlreadySent",
  UNKNOWN: "Unknown",
};

export type ReqStatus = {
  status: "AlreadyReceived" | "AlreadySent";
  request: ChatRequest;
};

type UnknownUser = {
  email: string;
  uid: string;
  emailVerified: boolean;
  displayName: string;
  gender?: "male" | "female" | "other" | string;
  photoUrl?: string;
  reqStatus: ReqStatus | "Unknown";
};

export default UnknownUser;
