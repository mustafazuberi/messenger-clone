import getStrangerUsers from "@/services/getStrangerUsers";
import { RootState } from "@/store";
import { FriendsState, UsersState } from "@/types/types.state";
import Stranger from "@/types/types.stranger";
import { useSelector } from "react-redux";

const useFindFriends = () => {
  const allUsers: UsersState = useSelector(
    (state: RootState) => state.allUsers
  );
  const friends: FriendsState = useSelector(
    (state: RootState) => state.friends
  );
  const strangers: Stranger[] = getStrangerUsers({
    allUsers: allUsers.data,
    friends: friends.data,
  });

  return { strangers };
};

export default useFindFriends;
