"use client";
import { useDispatch, useSelector } from "react-redux";
import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
import { RootState } from "@/store";
import CallDialog from "./CallDialog";
import { useEffect } from "react";
import { Call } from "@/types/types.call";
import { clearActiveCall, setActiveCall } from "@/store/slice/callSlice";
import { usePageVisibility } from "react-page-visibility";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const path = usePathname();
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const hideNavbar = path.includes("messages") && roomDetails?.id;
  return (
    <>
      <main
        className={`h-[11vh] px-3 ${
          hideNavbar ? "lg:flex md:flex hidden" : "flex"
        } flex-row justify-between items-center border-b`}
      >
        <MessengerTextAndLogo />
        <ThemeAndProfileImage />
      </main>
      {/* <CallDialog /> */}
    </>
  );
};

export default Navbar;
