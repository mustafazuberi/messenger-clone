"use client";
import { useDispatch, useSelector } from "react-redux";
import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
import { RootState } from "@/store";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/db/firebase.config";
import useProtectedRouting from "@/hooks/useProtectedRouting";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const path = usePathname();
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const allUsers = useSelector((state: RootState) => state.allUsers);
  const hideNavbar = path.includes("messages") && roomDetails?.id;
  const { handleProtectedRouting } = useProtectedRouting();

  useLayoutEffect(() => {
    handleProtectedRouting();
  }, [path]);

  // Firebase on auth state change listener
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      user && allUsers.data.find((u) => u.uid === user.uid)?.emailVerified
        ? dispatch(setAuthenticationStatus(true))
        : dispatch(setAuthenticationStatus(false));
    });
  }, []);

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
