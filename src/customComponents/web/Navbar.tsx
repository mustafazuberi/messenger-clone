"use client";
import { useDispatch, useSelector } from "react-redux";
import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
import { RootState } from "@/store";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import useProtectedRouting from "@/hooks/useProtectedRouting";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/db/firebase.config";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import { clearCurrentUser, updateUserDetails } from "@/store/slice/userSlice";
import useHome from "@/hooks/useHome";

const Navbar = () => {
  const dispatch = useDispatch();
  const path = usePathname();
  const router = useRouter();
  const { roomDetails } = useSelector((state: RootState) => state.activeRoom);
  const allUsers = useSelector((state: RootState) => state.allUsers);
  const authenticationStatus = useSelector(
    (state: RootState) => state.authenticationStatus
  );
  const hideNavbar = path.includes("messages") && roomDetails?.id;
  const { handleProtectedRouting } = useProtectedRouting();
  const { getAllUsers } = useHome();

  const memoizedGetAllUsers = useMemo(() => getAllUsers, []);

  useLayoutEffect(() => {
    handleProtectedRouting();
  }, [path, authenticationStatus]);

  useEffect(() => {
    memoizedGetAllUsers();
  }, [memoizedGetAllUsers]);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const cUser = allUsers.data.find((u) => u.uid === user.uid);
        if (cUser?.emailVerified) {
          dispatch(setAuthenticationStatus(true));
          dispatch(updateUserDetails({ ...cUser }));
          // router.push("/messages");
        } else {
          dispatch(setAuthenticationStatus(false));
          dispatch(clearCurrentUser());
          router.push("/auth/signin");
        }
      } else {
        dispatch(setAuthenticationStatus(false));
        dispatch(clearCurrentUser());
        router.push("/auth/signin");
      }
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
