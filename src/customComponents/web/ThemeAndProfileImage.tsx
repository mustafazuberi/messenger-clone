"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/db/firebase.config";
import { updateUserDetails } from "@/store/slice/userSlice";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import ProfileDropDown from "./ProfileDropDown";
import ThemeDropDown from "./ThemeDropDown";
import User from "@/types/types.user";
import NotificationDropdown from "./NotificationDropdown";

const ThemeAndProfileImage = () => {
  const authenticationStatus: boolean = useSelector(
    (state: RootState) => state.authenticationStatus
  );
  return (
    <main className="flex flex-row gap-x-3 items-center justify-center">
      <section>
        <ThemeDropDown />
      </section>
      {authenticationStatus && (
        <section className="flex flex-row gap-x-3 items-center">
          {/* <NotificationDropdown /> */}
          <ProfileDropDown />
        </section>
      )}
    </main>
  );
};

export default ThemeAndProfileImage;
