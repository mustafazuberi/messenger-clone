import User from "@/types/types.user";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/db/firebase.config";
import { Skeleton } from "@/components/ui/skeleton";

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
      {user.photoUrl ? (
        <>
          {imageLoading && (
            <Skeleton className={`rounded-full ${sizeW} ${sizeH}`} />
          )}
          <AvatarImage
            src={user.photoUrl}
            className={`rounded-full ${sizeW} ${sizeH}`}
            alt="@shadcn"
            onLoad={handleImageLoad}
          />
        </>
      ) : auth.currentUser?.photoURL ? (
        <>
          {imageLoading && (
            <Skeleton className={`rounded-full ${sizeW} ${sizeH}`} />
          )}
          <AvatarImage
            src={auth.currentUser?.photoURL}
            className={`rounded-full ${sizeW} ${sizeH}`}
            alt="@shadcn"
            onLoad={handleImageLoad}
          />
        </>
      ) : null}

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
