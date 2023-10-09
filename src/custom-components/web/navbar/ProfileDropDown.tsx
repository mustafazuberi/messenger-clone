"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Avatar } from "@radix-ui/react-avatar";
import { CiLogout, CiSettings } from "react-icons/ci";

function ProfileDropDown() {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center border w-[45px] h-[45px] rounded-full cursor-pointer">
          <Avatar>{currentUser.displayName.charAt(0)[0]?.toUpperCase()}</Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{currentUser.displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem className="flex flex-row gap-x-3 py-3 cursor-pointer">
          <CiSettings className="text-[20px]" /> Settings
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem className="flex flex-row gap-x-3 py-3 cursor-pointer">
          <CiLogout className="text-[20px]" /> Sign Out
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropDown;
