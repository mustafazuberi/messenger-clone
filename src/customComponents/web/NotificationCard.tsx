import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useNotification from "@/hooks/useNotification";
import { cn } from "@/lib/utils";
import getFormattedTime from "@/services/getFormattedTime";
import { STATUSES } from "@/store/intialState";
import UserNotification from "@/types/types.notification";
import { NotificationsState } from "@/types/types.state";

type NotificationCardProps = {
  unReadNotifications: UserNotification[];
  notifications: NotificationsState;
};

const NotificationCard = (notificationCardProps: NotificationCardProps) => {
  const { unReadNotifications, notifications } = notificationCardProps;
  const { handleOnNotification } = useNotification();

  return (
    <section>
      <Card className={cn("sm:w-[350px] w-[280px] mr-4 mt-1")}>
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-300">
            Notifications
          </CardTitle>
          {unReadNotifications.length ? (
            <CardDescription className="text-gray-700 dark:text-gray-300">
              You have {unReadNotifications.length} unread notification
              {unReadNotifications.length > 1 && "s"}.
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col">
            {notifications.status === STATUSES.LOADING ? (
              <section className="flex flex-col justify-center items-center w-full h-full">
                <NormalSpinner />
              </section>
            ) : notifications.data.length ? (
              notifications.data.map((notification: UserNotification) => (
                <div
                  key={notification._id!}
                  className="flex flex-row gap-x-2 cursor-pointer opacity-80 hover:opacity-100 py-2"
                  onClick={() => handleOnNotification(notification)}
                >
                  {notification.isRequestRead ? (
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  ) : null}
                  <div className="flex flex-row gap-x-2 space-y-1">
                    <p className="text-sm font-extralight leading-1 text-gray-700 dark:text-gray-300">
                      {notification.message}
                    </p>
                    <span className="text-[12px]">
                      {getFormattedTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center text-[22px] min-h-[140px]">
                In the current moment, you have not received any notifications
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default NotificationCard;

const NormalSpinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="inline w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
