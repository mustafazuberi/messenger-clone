import { FindFriendsNav } from "./FindFriends";
import UsersSkeleton from "./UsersSkeleton";

const FindFriendsSuspense = () => {
  return (
    <section className="px-2">
      <FindFriendsNav />
      <section className="mt-4">
        <UsersSkeleton skeletonLength={40} />
      </section>
    </section>
  );
};

export default FindFriendsSuspense;
