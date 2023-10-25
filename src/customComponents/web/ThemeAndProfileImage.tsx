"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ThemeDropDown from "./ThemeDropDown";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropDown from "./ProfileDropDown";

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
          <NotificationDropdown />
          <ProfileDropDown />
        </section>
      )}
    </main>
  );
};

export default ThemeAndProfileImage;
