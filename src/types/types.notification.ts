type Notifications = {
  notification_id: string;
  sender_id: string;
  receiver_id: string;
  type: "ChatRequestAccepted" | "ChatRequestReceived";
  message: string;
  timestamp: string;
  read: boolean;
};
