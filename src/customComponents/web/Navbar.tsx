"use client";
import { useSelector } from "react-redux";
import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
import { RootState } from "@/store";
const Navbar = () => {
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  return (
    <main
      className={`h-[11vh] px-3 ${
        roomDetails?.id ? "sm:flex hidden" : "flex"
      } flex-row justify-between items-center border-b`}
    >
      <MessengerTextAndLogo />
      <ThemeAndProfileImage />
    </main>
  );
};

export default Navbar;
