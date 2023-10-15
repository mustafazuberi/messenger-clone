import Friend from "@/types/type.friend";
import ChatRequest from "@/types/types.request";
import Stranger, { StrangerStatus } from "@/types/types.stranger";
import User from "@/types/types.user";

type getStrangerUsersParamType = {
  allUsers: User[];
  friends: Friend[];
  // sentReqs: ChatRequest[];
  // receivedReqs: ChatRequest[];
};

const filterStrangerUsers = (users: getStrangerUsersParamType): Stranger[] => {
  const { allUsers, friends } = users;

  const strangers: Stranger[] = allUsers
    .map((user: User) => {
      if (!friends.find((friend: Friend) => friend.uid === user.uid)) {
        const stranger: Stranger = {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          gender: user.gender,
          photoUrl: user.photoUrl,
        };
        return stranger;
      }
      return undefined;
    })
    .filter(
      (stranger: Stranger | undefined): stranger is Stranger =>
        stranger !== undefined
    );

  return strangers;
};

export default filterStrangerUsers;
