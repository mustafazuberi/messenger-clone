import { Button } from "@/components/ui/button";
import useReq from "@/hooks/useReq";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import UsersSkeleton from "./ChatUsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";

const ReceivedRequests = () => {
  const receivedRequests = useSelector(
    (state: RootState) => state.chatRequests.receivedRequests
  );
  const { confirmChatRequest } = useReq();

  return (
    <section className="mt-3 flex flex-col gap-y-4">
      {receivedRequests.data?.length && receivedRequests.status === "idle" ? (
        receivedRequests.data?.map((req) => (
          <section className="flex flex-row justify-between px-1 " key={req.id}>
            <section className="flex flex-row gap-x-3">
              <section>
                <UserImageAvatar user={req.sender} />
              </section>
              <section className="flex flex-col ">
                <h3>{req.sender.displayName}</h3>
                <h6 className="text-[12px]">{req.sender.email}</h6>
              </section>
            </section>
            <section>
              <Button
                variant={"outline"}
                className="px-3 h-8"
                onClick={() => confirmChatRequest(req)}
              >
                Confirm
              </Button>
            </section>
          </section>
        ))
      ) : false && receivedRequests.status === "loading" ? (
        <UsersSkeleton skeletonLength={7} />
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            You have no requests to accept.
          </h1>
        </section>
      )}
    </section>
  );
};

export default ReceivedRequests;
