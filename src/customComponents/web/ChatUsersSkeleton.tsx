import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const UsersSkeleton = React.memo(
  ({ skeletonLength }: { skeletonLength: number }) => {
    return (
      <main className="flex flex-col gap-y-8">
        {[...Array(skeletonLength)].map((_, index) => (
          <div className="flex items-center space-x-4" key={index}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[240px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </main>
    );
  }
);

export default UsersSkeleton;
