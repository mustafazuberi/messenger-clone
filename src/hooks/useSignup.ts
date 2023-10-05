"use client";

import React from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage, db } from "@/db/firebase.config";
import formSchema from "@/schema/schema.signupForm";
import { doc, setDoc } from "firebase/firestore";
import User from "@/types/types.user";

type UserToAddInDb = {
  values: z.infer<typeof formSchema>;
  userCred: UserCredential;
  PhotoUrlFirebase: string;
};

const useSignup = () => {
  const [openEmailSent, setOpenEmailSent] = React.useState<boolean>(false);
  const [emailSentTo, setEmailSentTo] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      gender: "",
      password: "",
      profilePhoto: "",
    },
  });

  const addUserToDB = async (userDetails: UserToAddInDb): Promise<void> => {
    const { values, userCred, PhotoUrlFirebase } = userDetails;
    const userObj: User = {
      email: values?.email,
      password: values?.password,
      displayName: values?.fullName,
      gender: values.gender,
      emailVerified: false,
      photoUrl: PhotoUrlFirebase,
      friends: [],
      uid: userCred.user.uid,
    };
    try {
      await setDoc(doc(db, "users", userCred.user.uid), userObj);
    } catch (error) {
      console.log(error);
      throw new Error("Error while adding user in firestore Database!");
    }
  };

  const sendVerificationEmail = async (
    userCred: UserCredential
  ): Promise<void> => {
    await sendEmailVerification(userCred.user); // Firebase function for sending email verification to created user
    setOpenEmailSent(true); // it opens Email sent Modal
    setEmailSentTo(userCred.user.email!); // This will set the user email we have sent email in above line which we will use in dialog modal
  };

  const createImageUrlFirebase = async (file: string): Promise<string> => {
    const fileBlob = new Blob([file]);
    const storageRef = ref(storage, `images/profile pictures`);
    const snapshot = await uploadBytes(storageRef, fileBlob);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  // This function will execute on clicking signup form submit button
  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    const { fullName, email, password, profilePhoto } = values;
    try {
      setLoading(true);
      const PhotoUrlFirebase = await createImageUrlFirebase(profilePhoto); // Creating Image Url Using Firebae Storage for setting it in profile image

      const userCred: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // creating user using email and password in firebase
      if (!userCred) return;

      // adding display name and photourl in firebase authentication profile
      await updateProfile(auth.currentUser!, {
        displayName: fullName,
        photoURL: PhotoUrlFirebase,
      });

      await addUserToDB({ values, userCred, PhotoUrlFirebase }); // This will add user details in firestore

      await sendVerificationEmail(userCred); // Firebase email verification

      setLoading(false); // setting loading of submit button false
      form.reset(); // React hook form function to reset form
    } catch (error) {
      setLoading(false);
      throw new Error("Error in Signup Function!");
    }
  }

  return {
    form,
    onSubmit,
    emailSentTo,
    loading,
    openEmailSent,
    setOpenEmailSent,
  };
};

export default useSignup;
