import { getToken } from "firebase/messaging";
import { messaging } from "@/db/firebase.config";

const useFCM = () => {
  const requestPermissionCloudMessaging = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate token
      const token = await getToken(messaging, {
        vapidKey:
          "BEqeZLQXRddjBldjjB7yYbpukTpJSkScJRgehWuStP_hpZxAAsSI3fsrdyOat9waVUoNO0vcbLGCfdJ9Z2hjfaw",
      });
      console.log("token generated---- ", token);
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  };

  return { requestPermissionCloudMessaging };
};

export default useFCM;
