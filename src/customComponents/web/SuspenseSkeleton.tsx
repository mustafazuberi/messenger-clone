import UsersSkeleton from "./UsersSkeleton";

const SuspenseSkeleton = () => {
  return (
    <section className="mt-4 px-2">
      <UsersSkeleton skeletonLength={40} />
    </section>
  );
};

export default SuspenseSkeleton;
