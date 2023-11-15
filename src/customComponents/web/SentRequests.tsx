import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import useReq from "@/hooks/useReq";
import UsersSkeleton from "./UsersSkeleton";
import UserImageAvatar from "./UserImageAvatar";
import { useTheme } from "next-themes";
import ChatRequest from "@/types/types.request";

const SentRequests = () => {
  const sentReqs = useSelector(
    (state: RootState) => state.chatRequests.sentRequests
  );

  return (
    <section className="min-w-full flex flex-col items-center flex-1 max-h-full overflow-y-auto scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-w-3 scrollbar-track-inherit">
      {sentReqs.status === "loading" ? (
        <UsersSkeleton skeletonLength={7} />
      ) : sentReqs.data?.length ? (
        sentReqs.data?.map((req, i) => <SentReqUser key={i} req={req} />)
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

export default SentRequests;

const SentReqUser = ({ req }: { req: ChatRequest }) => {
  const { theme } = useTheme();
  const hover = theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-300";
  const { unsendChatRequest, loading } = useReq();
  return (
    <section
      className={`flex flex-row justify-between items-center px-2 min-w-full cursor-pointer p-2 py-4 border-b ${hover}`}
    >
      <section className="flex flex-row gap-x-3">
        <section>
          <UserImageAvatar user={req.receiver} />
        </section>
        <section className="flex flex-col ">
          <h3>{req.receiver.displayName}</h3>
          <h6 className="text-[12px]">{req.receiver.email}</h6>
        </section>
      </section>
      <section>
        <Button
          className="w-[70px] h-8"
          onClick={() => unsendChatRequest(req)}
          disabled={loading}
        >
          Unsend
        </Button>
      </section>
    </section>
  );
};
