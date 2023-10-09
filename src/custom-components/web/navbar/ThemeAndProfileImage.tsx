"use client";
import ProfileDropDown from "./ProfileDropDown";
import ThemeDropDown from "./ThemeDropDown";

const ThemeAndProfileImage = () => {
  return (
    <section className="flex flex-row gap-x-3 items-center justify-center">
      <section>
        <ThemeDropDown />
      </section>
      <section>
        <ProfileDropDown />
      </section>
    </section>
  );
};

export default ThemeAndProfileImage;
