import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { ActiveTab } from "@/types/types.miscellaneous";

type props = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

const RequestsNav = ({ activeTab, setActiveTab }: props) => {
  const handleActiveTabToggle = () => {
    if (activeTab === "receivedRequests") {
      setActiveTab("sentRequests");
    } else {
      setActiveTab("receivedRequests");
    }
  };
  return (
    <section className="flex flex-row justify-between items-center w-full mt-2 p-2">
      <section className="flex flex-row gap-x-2 items-center">
        <section>
          <Link prefetch href={"/messages"}>
            <BiArrowBack className="cursor-pointer text-2xl text-gray-700 dark:text-gray-300" />
          </Link>
        </section>
        <section>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {activeTab === "receivedRequests" && "Requests"}
            {activeTab === "sentRequests" && "Sent Requests"}
          </h3>
        </section>
      </section>
      <section className="flex flex-row gap-x-2 items-center">
        <span
          className="text-[14px] cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400"
          onClick={handleActiveTabToggle}
        >
          {activeTab === "sentRequests" && "Requests"}
          {activeTab === "receivedRequests" && "Sent Requests"}
        </span>
      </section>
    </section>
  );
};

export default RequestsNav;
