"use client";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ChatsBox from "@/customComponents/web/ChatsBox";

const ChatPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const roomId = roomDetails?.id;
  return (
    <section className="flex flex-row flex-1 w-full max-h-[89vh] min-h-[89vh]">
      <section
        className={`lg:w-[30%] md:min-w-[300px] lg:flex md:flex ${
          !roomId ? "flex" : "hidden"
        } min-w-full lg:max-w-[400px] md:max-w-[400px] max-w-full min-h-full`}
      >
        <ChatsBox />
      </section>
      <section className="flex flex-1 w-full">{children}</section>
    </section>
  );
};

export default ChatPageWrapper;
