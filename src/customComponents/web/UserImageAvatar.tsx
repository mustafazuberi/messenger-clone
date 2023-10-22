import User from "@/types/types.user";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

type props = { user: User; size?: Number };

const UserImageAvatar = ({ user, size }: props) => {
  return (
    <Avatar>
      <AvatarImage
        src={user.photoUrl}
        className="rounded-full w-12 h-12 "
        alt="@shadcn"
      />
      <AvatarFallback>
        <div
          className={`${size ? "w-" + size : "w-12"} ${
            size ? "h-" + size : "h-12"
          } rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
        >
          {user.displayName.charAt(0)[0]?.toUpperCase()}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserImageAvatar;

{
  /* <Skeleton className="h-12 w-12 rounded-full" /> */
}
