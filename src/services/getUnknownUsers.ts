import Friend from "@/types/type.friend";
import ChatRequest from "@/types/types.request";
import User from "@/types/types.user";

type getUnknownUsersParamType = {
  allUsers: User[];
  friends: Friend[];
  sentReqs: ChatRequest[];
  receivedReqs: ChatRequest[];
};

const getUnknownUsers = (data: getUnknownUsersParamType): User[] => {
  const { allUsers, friends, sentReqs, receivedReqs } = data;
  const unknownUsers: User[] = allUsers
    .map((user: User) => {
      if (!friends.find((friend: Friend) => friend.uid === user.uid)) {
        let alreadyReceivedReq: ChatRequest | undefined = receivedReqs.find(
          (rr) => user.uid === rr.senderId
        );

        let alreadySentReq: ChatRequest | undefined = sentReqs.find(
          (sr) => user.uid === sr.receiverId
        );

        if (!alreadySentReq && !alreadyReceivedReq) {
          const unknown: User = {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
            gender: user.gender,
            photoUrl: user.photoUrl,
            emailVerified: user.emailVerified,
          };
          return unknown;
        }
      }
      return undefined;
    })
    .filter(
      (stranger: User | undefined): stranger is User => stranger !== undefined
    );

  return unknownUsers;
};

export default getUnknownUsers;
