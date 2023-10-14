import Stranger from "./types.stranger";

export type RequestNotification = {
  sender: Stranger;
  receiver: Stranger;
  notification_id: string;
  message: string;
  timestamp: string;
  read: boolean;
  accepted: boolean;
};

export type notification = RequestNotification;
