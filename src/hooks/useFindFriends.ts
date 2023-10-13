import getStrangerUsers from "@/services/getStrangerUsers";
import { RootState } from "@/store";
import Friend from "@/types/type.friend";
import Stranger from "@/types/types.stranger";
import User from "@/types/types.user";
import { useSelector } from "react-redux";

const useFindFriends = () => {
  const allUsers: User[] = useSelector((state: RootState) => state.allUsers);
  const friends: Friend[] = useSelector((state: RootState) => state.friends);
  const strangers: Stranger[] = getStrangerUsers({ allUsers, friends });

  return { strangers };
};

export default useFindFriends;
