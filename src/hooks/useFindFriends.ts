import getStrangerUsers from "@/services/getStrangerUsers";
import { RootState } from "@/store";
import Stranger from "@/types/types.stranger";
import { useSelector } from "react-redux";

const useFindFriends = () => {
  const allUsers = useSelector((state: RootState) => state.allUsers);
  const findFriendsUsers: Stranger[] = getStrangerUsers();

  return {};
};

export default useFindFriends;
