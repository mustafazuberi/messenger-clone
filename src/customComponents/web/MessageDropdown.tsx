import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { RiArrowDownSLine } from "react-icons/ri";
import { LuForward } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdOutlineDeleteSweep } from "react-icons/md";
import useSendMessage from "@/hooks/useSendMessage";
import Message from "@/types/types.message";

type Props = {
  message: Message;
  setOpenForwardMessageModal: (value: {
    open: boolean;
    message: Message;
  }) => void;
};

const MessageDropDown: React.FC<Props> = ({
  message,
  setOpenForwardMessageModal,
}) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <RiArrowDownSLine className="text-[18px] text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="py-2 cursor-pointer flex flex-row gap-x-3"
          onClick={() =>
            setOpenForwardMessageModal({
              open: true,
              message: message,
            })
          }
        >
          <LuForward className="text-2xl" />
          <span>Forward</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropDown;
