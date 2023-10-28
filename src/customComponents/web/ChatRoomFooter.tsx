"use client";
import { Input } from "@/components/ui/input";
import { BsFillSendFill, BsEmojiSmile, BsCameraFill } from "react-icons/bs";
import {
  AiFillAudio,
  AiOutlineCloseCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useChat from "@/hooks/useChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const ChatRoomFooter = () => {
  const { sendMessage, messageInp, setMessageInp } = useChat();
  return (
    <main className="py-6 sm:px-5 px-2 ">
      <form
        onSubmit={sendMessage}
        className="w-full flex flex-row gap-x-4 items-center"
      >
        <Popover>
          <PopoverTrigger asChild>
            <button>
              <BsEmojiSmile className="text-3xl cursor-pointer text-gray-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={({ emoji }) => setMessageInp((e) => e + emoji)}
            />
          </PopoverContent>
        </Popover>
        <PlusDropdown />
        <Input
          placeholder="Type your message..."
          value={messageInp}
          onChange={(e) => setMessageInp(e.target.value)}
          className="text-[17px]"
        />
        {messageInp ? (
          <BsFillSendFill className="text-3xl text-gray-400" />
        ) : (
          <AiFillAudio className="text-4xl cursor-pointer text-gray-400" />
        )}
      </form>
    </main>
  );
};

export default ChatRoomFooter;

const PlusDropdown = () => {
  const [plusDropdownOpened, setPlusDropdownOpened] = useState(false);
  return (
    <DropdownMenu onOpenChange={() => setPlusDropdownOpened((prev) => !prev)}>
      <DropdownMenuTrigger>
        {plusDropdownOpened ? (
          <AiOutlineCloseCircle className="text-4xl cursor-pointer text-gray-400" />
        ) : (
          <AiOutlinePlusCircle className="text-4xl cursor-pointer text-gray-400" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem className="flex flex-row gap-x-3 text-[15px] py-3 cursor-pointer">
          <IoMdPhotos className="text-2xl text-blue-700" />
          Photos & Videos
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row gap-x-3 text-[15px] py-3 cursor-pointer">
          <BsCameraFill className="text-2xl text-pink-800" />
          Camera
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row gap-x-3 text-[15px] py-3 cursor-pointer">
          <FaUserFriends className="text-2xl text-blue-700" />
          Friend
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
