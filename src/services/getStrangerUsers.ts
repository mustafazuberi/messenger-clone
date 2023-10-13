import Friend from "@/types/type.friend";
import Stranger from "@/types/types.stranger";
import User from "@/types/types.user";

type getStrangerUsersParamType = {
  allUsers: User[];
  friends: Friend[];
};

const getStrangerUsers = (users: getStrangerUsersParamType): Stranger[] => {
  const { allUsers, friends } = users;

  const strangers: Stranger[] = allUsers
    .map((u: User) => {
      if (!friends.find((f: Friend) => f.uid === u.uid)) {
        const s: Stranger = {
          displayName: u.displayName,
          email: u.email,
          uid: u.uid,
          gender: u.gender,
          photoUrl: u.photoUrl,
        };
        return s;
      }
      return undefined;
    })
    .filter(
      (stranger: Stranger | undefined): stranger is Stranger =>
        stranger !== undefined
    );

  return strangers;
};

export default getStrangerUsers;
