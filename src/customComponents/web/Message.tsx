import { useSelector } from "react-redux";
import { RootState } from "@/store";
import getFormattedTime from "@/services/getFormattedTime";
import Message from "@/types/types.message";
import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const Message = ({ msg }: { msg: Message }) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const byMe = msg.senderId === currentUser.uid ? true : false;

  return (
    <section
      className={`w-full flex items-center ${
        byMe ? "justify-end" : "justify-start"
      }`}
    >
      <section
        className={`${
          byMe ? "bg-[#3b82f6]" : "bg-[#1e293b]"
        } text-white max-w-[70%] px-2 py-2 rounded-[6px] rounded-tr-none`}
      >
        {msg.text && (
          <section className="flex flex-row justify-between gap-x-3">
            <section className="text-[15px] font-extralight">
              {msg.text}
            </section>
            <section className="flex flex-row justify-between items-end gap-x-1">
              <section className="text-[9px] font-extralight flex items-end">
                {getFormattedTime(msg.date)}
              </section>
              {byMe && <section className="relative mb-1">{false ? <OneCheck /> : <TwoCheck />}</section>}
            </section>
          </section>
        )}
      </section>
    </section>
  );
};

export default Message;

const OneCheck = () => {
  return (
    <section className="flex flex-col justify-end items-end">
      <IoMdCheckmark className="text-gray-300 relative top-1" />
    </section>
  );
};

const TwoCheck = () => {
  return (
    <section className="flex flex-col justify-end items-end">
      <IoCheckmarkDoneSharp className="text-gray-300 relative top-1" />
    </section>
  );
};
