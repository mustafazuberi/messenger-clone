"use client";
import { useRouter } from "next/navigation";
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
import { CiLogout, CiSettings } from "react-icons/ci";
import useHome from "@/hooks/useHome";
import UserImageAvatar from "./UserImageAvatar";
import Link from "next/link";

function ProfileDropDown() {
  const { handleSignOut } = useHome();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center border w-[45px] h-[45px] rounded-full cursor-pointer">
          <UserImageAvatar user={currentUser} size={10} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{currentUser.displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link prefetch href={"/profile/settings"}>
          <DropdownMenuCheckboxItem className="flex flex-row gap-x-3 py-3 cursor-pointer">
            <CiSettings className="text-[20px]" /> Settings
          </DropdownMenuCheckboxItem>
        </Link>

        <DropdownMenuCheckboxItem
          className="flex flex-row gap-x-3 py-3 cursor-pointer"
          onClick={handleSignOut}
        >
          <CiLogout className="text-[20px]" /> Sign Out
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropDown;
