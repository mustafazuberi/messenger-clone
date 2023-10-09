"use client";
import { useSelector } from "react-redux";
import ProfileDropDown from "./ProfileDropDown";
import ThemeDropDown from "./ThemeDropDown";
import { RootState } from "@/store";

const ThemeAndProfileImage = () => {
  const authenticationStatus = useSelector(
    (state: RootState) => state.authenticationStatus
  );
  return (
    <section className="flex flex-row gap-x-3 items-center justify-center">
      <section>
        <ThemeDropDown />
      </section>
      {authenticationStatus && (
        <section>
          <ProfileDropDown />
        </section>
      )}
    </section>
  );
};

export default ThemeAndProfileImage;
