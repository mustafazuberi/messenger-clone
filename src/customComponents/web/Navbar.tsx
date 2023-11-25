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

const Navbar = () => {
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);

  return (
    <>
      <main
        className={`h-[11vh] px-3 ${
          roomDetails?.id ? "lg:flex md:flex hidden" : "flex"
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
