"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BsThreeDots,
  BsFillPersonLinesFill,
  BsFillArchiveFill,
} from "react-icons/bs";
import { AiOutlinePullRequest, AiOutlineCheck } from "react-icons/ai";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

const ChatsNavDropDown = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const menuItem: string = searchParams.get("menuItem") || "all";

  const menuItemValues = {
    ACTIVE_CHATS: "activeChats",
    ARCHIVED_CHATS: "archivedChats",
    MESSAGE_REQUESTS: "messageRequests",
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleOptionChange = (value: string): void => {
    if (value?.toString() === menuItem) {
      router.push("/");
      return;
    }
    router.push(pathname + "?" + createQueryString("menuItem", value));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Chats</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="py-3"
            onClick={() => handleOptionChange(menuItemValues.ACTIVE_CHATS)}
          >
            <div>
              {menuItem === menuItemValues.ACTIVE_CHATS && <AiOutlineCheck />}
            </div>
            <div className="flex flex-row gap-x-1">
              <BsFillPersonLinesFill className="mr-2 h-4 w-4" />
              <span>Active contacts</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3"
            onClick={() => handleOptionChange(menuItemValues.ARCHIVED_CHATS)}
          >
            <div>
              {menuItem === menuItemValues.ARCHIVED_CHATS && <AiOutlineCheck />}
            </div>
            <div className="flex flex-row gap-x-1">
              <BsFillArchiveFill className="mr-2 h-4 w-4" />
              <span>Archived chats</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-3"
            onClick={() => handleOptionChange(menuItemValues.MESSAGE_REQUESTS)}
          >
            <div>
              {menuItem === menuItemValues.MESSAGE_REQUESTS && (
                <AiOutlineCheck />
              )}
            </div>
            <div className="flex flex-row gap-x-1">
              <AiOutlinePullRequest className="mr-2 h-4 w-4" />
              <span>Message requests</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatsNavDropDown;
