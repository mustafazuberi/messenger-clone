"use client";
import { useSelector } from "react-redux";
import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
import { RootState } from "@/store";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import useProtectedRouting from "@/hooks/useProtectedRouting";

const Navbar = () => {
  const path = usePathname();
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const hideNavbar = path.includes("messages") && roomDetails?.id;
  const { handleProtectedRouting } = useProtectedRouting();

  useLayoutEffect(() => {
    handleProtectedRouting();
  }, [path]);

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
