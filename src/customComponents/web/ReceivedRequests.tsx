import { Button } from "@/components/ui/button";
import useReq from "@/hooks/useReq";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import UsersSkeleton from "./ChatUsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";
import { useTheme } from "next-themes";
import ChatRequest from "@/types/types.request";
import { STATUSES } from "@/store/intialState";

const ReceivedRequests = () => {
  const receivedReqs = useSelector(
    (state: RootState) => state.chatRequests.receivedRequests
  );

  return (
    <section className="min-w-full flex flex-col items-center flex-1 max-h-full overflow-y-auto scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-w-3 scrollbar-track-inherit">
      {receivedReqs.status === STATUSES.IDLE && receivedReqs.data.length ? (
        receivedReqs.data?.map((req, i) => (
          <ReceivedReqUser key={i} req={req} />
        ))
      ) : (
        <section className="flex flex-col justify-center gap-y-2 items-center mt-4 px-4">
          <h1 className="text-[19px] font-light">
            You haven't reached out to anyone with requests.
          </h1>
        </section>
      )}
    </section>
  );
};

export default ReceivedRequests;

const ReceivedReqUser = ({ req }: { req: ChatRequest }) => {
  const { confirmChatRequest, loading } = useReq();
  const { theme } = useTheme();
  const hover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-300";

  return (
    <section
      className={`flex flex-row justify-between items-center px-2 min-w-full cursor-pointer p-2 py-4 border-b ${hover}`}
    >
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
          className="px-3 h-8"
          onClick={() => confirmChatRequest(req)}
          disabled={loading}
        >
          Confirm
        </Button>
      </section>
    </section>
  );
};
