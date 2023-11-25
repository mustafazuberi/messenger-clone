import { Input } from "@/components/ui/input";
import useSendMessage from "@/hooks/useSendMessage";
import { RootState } from "@/store";
import Friend from "@/types/type.friend";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImageAvatar from "./UserImageAvatar";
import TailwindSpinner from "./TailwindSpinner";
import { RiSendPlane2Fill } from "react-icons/ri";

const ShareFriendWithModal = () => {
  const {
    shareWithInp,
    setShareWithInp,
    sharingWith,
    handleOnShareFriend,
  } = useSendMessage();
  const friends = useSelector((state: RootState) => state.friends);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const filtered = friends.data.filter((friend: Friend) =>
      friend.displayName.toLowerCase().includes(shareWithInp.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [shareWithInp, friends.data]);

  return (
    <section className="mt-5 min-h-[300px]">
      <Input
        placeholder="Find Friends"
        value={shareWithInp}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setShareWithInp(e.target.value)
        }
      />
      <section className="mt-4">
        {filteredFriends.length ? (
          filteredFriends.map((friend: Friend) => (
            <section
              className="flex flex-row justify-between items-center border-b"
              key={friend.uid}
            >
              <section className="flex flex-row gap-x-3 w-full items-center py-2">
                <section>
                  <UserImageAvatar user={friend} size={10} />
                </section>
                <section>
                  <h3>{friend.displayName}</h3>
                </section>
              </section>
              <section>
                {sharingWith === friend?.uid ? (
                  <TailwindSpinner size={5} />
                ) : (
                  <RiSendPlane2Fill
                    className="text-2xl cursor-pointer"
                    onClick={() => handleOnShareFriend(friend)}
                  />
                )}
              </section>
            </section>
          ))
        ) : (
          <section className="flex justify-center items-center px-3 text-2xl font-extrabold">
            No Friends To share with
          </section>
        )}
      </section>
    </section>
  );
};

export default ShareFriendWithModal;
