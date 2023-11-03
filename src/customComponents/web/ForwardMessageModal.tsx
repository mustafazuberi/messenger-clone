import { Input } from "@/components/ui/input";
import useSendMessage from "@/hooks/useSendMessage";
import { RootState } from "@/store";
import Friend from "@/types/type.friend";
import Message from "@/types/types.message";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserImageAvatar from "./UserImageAvatar";
import { RiSendPlane2Fill } from "react-icons/ri";
import TailwindSpinner from "./TailwindSpinner";

const ForwardMessageModal: React.FC<{ message: Message | null }> = ({
  message,
}) => {
  if (!message) return;

  const { findFriendInp, setFindFriendInp, handleForwardMessage, forwarding } =
    useSendMessage();
  const friends = useSelector((state: RootState) => state.friends);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const filtered = friends.data.filter((friend: Friend) =>
      friend.displayName.toLowerCase().includes(findFriendInp.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [findFriendInp, friends.data]);

  return (
    <section className="mt-5 min-h-[300px]">
      <Input
        placeholder="Find Friends"
        value={findFriendInp}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFindFriendInp(e.target.value)
        }
      />
      <section className="mt-4">
        {filteredFriends.map((friend: Friend) => (
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
              {forwarding.forwarding && friend.uid === forwarding.to?.uid ? (
                <TailwindSpinner size={5} />
              ) : (
                <RiSendPlane2Fill
                  className="text-2xl cursor-pointer"
                  onClick={() =>
                    handleForwardMessage({ msg: message, forwardTo: friend })
                  }
                />
              )}
            </section>
          </section>
        ))}
      </section>
    </section>
  );
};

export default ForwardMessageModal;
