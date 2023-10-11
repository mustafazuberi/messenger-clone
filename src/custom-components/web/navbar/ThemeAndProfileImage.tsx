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

const ThemeAndProfileImage = () => {
  const dispatch = useDispatch();
  const authenticationStatus = useSelector(
    (state: RootState) => state.authenticationStatus
  );

  // Auth state change by firebase to set in redux if something change in user data
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      let userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.data()) return;
      let firestoreUser: User = userDoc.data() as User;
      dispatch(updateUserDetails({ ...firestoreUser }));
      dispatch(setAuthenticationStatus(true));
      return;
    } else {
      dispatch(setAuthenticationStatus(false));
    }
  });
  return (
    <main className="flex flex-row gap-x-3 items-center justify-center">
      <section>
        <ThemeDropDown />
      </section>
      {authenticationStatus && (
        <section>
          <ProfileDropDown />
        </section>
      )}
    </main>
  );
};

export default ThemeAndProfileImage;
