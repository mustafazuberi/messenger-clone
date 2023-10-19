import User from "./types.user";

export type SendChatReqParam = {
  sender: User;
  receiver: User;
};

export type SendNotificationParam = {
  type: "Request Accepted" | "Request Received";
  to: User;
  by : User
};
