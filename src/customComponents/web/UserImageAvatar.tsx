import User from "@/types/types.user";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

type Props = { user: User; size?: number };

const UserImageAvatar = ({ user, size }: Props) => {
  const [imageLoading, setImageLoading] = useState(true);
  const sizeW = size ? `w-${size}` : "w-12";
  const sizeH = size ? `h-${size}` : "h-12";

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Avatar>
      {user.photoUrl && (
        <>
          {imageLoading && (
            <Skeleton className={`rounded-full ${sizeW} ${sizeH}`} />
          )}
          <Image
            src={user.photoUrl}
            className={`rounded-full ${sizeW} ${sizeH}`}
            alt="User Profile Photo"
            onLoad={handleImageLoad}
            width={40}
            height={40}
          />
        </>
      )}

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
