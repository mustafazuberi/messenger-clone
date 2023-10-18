import Friend from "@/types/type.friend";
import ChatRequest from "@/types/types.request";
import User from "@/types/types.user";
import UnknownUser from "@/types/types.UnknownUser";

type getUnknownUsersParamType = {
  allUsers: User[];
  friends: Friend[];
  sentReqs: ChatRequest[];
  receivedReqs: ChatRequest[];
};

const getUnknownUsers = (data: getUnknownUsersParamType): UnknownUser[] => {
  const { allUsers, friends, sentReqs, receivedReqs } = data;
  const unknownUsers: UnknownUser[] = allUsers
    .map((user: User) => {
      if (!friends.find((friend: Friend) => friend.uid === user.uid)) {
        let alreadyReceivedReq: ChatRequest | undefined = receivedReqs.find(
          (rr) => user.uid === rr.senderId
        );

        let alreadySentReq: ChatRequest | undefined = sentReqs.find(
          (sr) => user.uid === sr.receiverId
        );

        const unknown: UnknownUser = {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          gender: user.gender,
          photoUrl: user.photoUrl,
          emailVerified: user.emailVerified,
          reqStatus: alreadySentReq
            ? { status: "AlreadySent", request: alreadySentReq }
            : alreadyReceivedReq
            ? { status: "AlreadyReceived", request: alreadyReceivedReq }
            : "Unknown",
        };

        return unknown;
      }
      return undefined;
    })
    .filter(
      (stranger: UnknownUser | undefined): stranger is UnknownUser =>
        stranger !== undefined
    );

  return unknownUsers;
};

export default getUnknownUsers;
