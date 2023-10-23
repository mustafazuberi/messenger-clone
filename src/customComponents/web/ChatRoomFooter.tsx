"use client";
import { Input } from "@/components/ui/input";
import { BsFillSendFill, BsEmojiSmile, BsPlusCircle } from "react-icons/bs";
import { AiFillAudio } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import useChat from "@/hooks/useChat";

const ChatRoomFooter = () => {
  const { sendMessage, message, setMessage } = useChat();
  return (
    <main className="mb-6">
      <form
        onSubmit={sendMessage}
        className="w-full flex flex-row gap-x-4 items-center"
      >
        <EmojiDropdown />
        <BsPlusCircle className="text-3xl cursor-pointer" />
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {message ? (
          <BsFillSendFill className="text-3xl" />
        ) : (
          <AiFillAudio className="text-3xl" />
        )}
      </form>
    </main>
  );
};

export default ChatRoomFooter;

const EmojiDropdown = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <BsEmojiSmile className="text-3xl cursor-pointer" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <EmojiPicker theme="dark" />
      </PopoverContent>
    </Popover>
  );
};
