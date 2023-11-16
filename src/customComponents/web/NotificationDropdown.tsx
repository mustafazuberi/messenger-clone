import { Button } from "@/components/ui/button";
import { RiNotification2Fill } from "react-icons/ri";
import { useEffect } from "react";
import useNotification from "@/hooks/useNotification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import NotificationCard from "./NotificationCard";

const NotificationDropdown = () => {
  const {
    fetchNotifications,
    handleNotificationDropdown,
    unReadNotifications,
    notifications,
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <section>
      <DropdownMenu onOpenChange={handleNotificationDropdown}>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-row gap-x-0 relative">
            {unReadNotifications.length ? (
              <div className="px-2 py-1 font-bold rounded-full text-[12px] bg-red-600 absolute -top-1 left-8 text-white flex justify-center items-center">
                {unReadNotifications.length}
              </div>
            ) : null}
            <Button variant="outline" className="rounded-full w-12 h-12 p-0">
              <RiNotification2Fill className="text-[20px] text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <NotificationCard
            unReadNotifications={unReadNotifications}
            notifications={notifications}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
};

export default NotificationDropdown;
