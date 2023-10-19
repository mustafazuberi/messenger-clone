import User from "./types.user";

type ReqNotification = {
  _id?: string;
  message: string;
  timestamp: number;
  type: "Request Accepted" | "Request Received";
  notificationBy: User;
  isNotificationRead: boolean;
  isRequestRead: boolean;
};

type UserNotification = ReqNotification;

export default UserNotification;
