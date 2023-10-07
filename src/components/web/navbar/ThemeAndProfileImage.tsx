"use client";
import { CiDark, CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { ToggleTheme } from "@/store/slice/themeSlice";
import { RootState } from "@/store";
import ProfileDropDown from "./ProfileDropDown";

const ThemeAndProfileImage = () => {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  return (
    <section className="flex flex-row gap-x-3 items-center justify-center">
      <div>
        {theme === "light" ? (
          <CiDark
            className="cursor-pointer text-3xl"
            onClick={() => dispatch(ToggleTheme("dark"))}
          />
        ) : (
          <CiLight
            className="cursor-pointer text-3xl"
            onClick={() => dispatch(ToggleTheme("light"))}
          />
        )}
      </div>
      <div>
        <ProfileDropDown />
      </div>
    </section>
  );
};

export default ThemeAndProfileImage;
