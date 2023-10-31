import User from "@/types/types.user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

type props = { user: User; size?: Number };

const UserImageAvatar = ({ user, size }: props) => {
  const sizeW = size ? `w-${size}` : "w-12";
  const sizeH = size ? `h-${size}` : "h-12";
  return (
    <Avatar>
      <AvatarImage
        src={user.photoUrl}
        className={`rounded-full ${sizeW} ${sizeH}`}
        alt="@shadcn"
      />
      {!user.photoUrl && (
        <AvatarFallback>
          <div
            className={`${sizeW} ${sizeH} rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
          >
            {user.displayName.charAt(0)[0]?.toUpperCase()}
          </div>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserImageAvatar;

{
  /* <Skeleton className="h-12 w-12 rounded-full" /> */
}
