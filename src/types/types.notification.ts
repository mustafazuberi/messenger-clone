type ReqNotification = {
  _id?: string;
  message: string;
  timestamp: number;
  type: "Request Accepted" | "Request Received";
  by: string;
  to: string;
  isNotificationRead: boolean;
  isRequestRead: boolean;
  requestId: string;
};

type UserNotification = ReqNotification;

export default UserNotification;
