"use client";

import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/db/firebase.config";
import bcrypt from "bcryptjs";
import formSchema from "@/schema/schema.signupForm";
import User from "@/types/types.user";
import getErrorMessage from "@/services/getErrorMessage";

type UserToAddInDb = {
  values: z.infer<typeof formSchema>;
  userCred: UserCredential;
  PhotoUrlFirebase?: string;
};

const useSignup = () => {
  const { toast } = useToast();
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
    },
  });

  const createHashedPassword = (password: string): string => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  };

  const addUserToDB = async (userDetails: UserToAddInDb): Promise<void> => {
    const { values, userCred } = userDetails;
    const hashedPassword = createHashedPassword(values.password);

    const userObj: User = {
      email: values?.email,
      password: hashedPassword, //created hashed password using bcrypt & storing in DB
      displayName: values?.fullName,
      gender: values.gender,
      emailVerified: false,
      friends: [],
      uid: userCred.user.uid,
    };
    if (userDetails.PhotoUrlFirebase) {
      userObj["photoUrl"] = userDetails.PhotoUrlFirebase;
    }
    try {
      await setDoc(doc(db, "users", userCred.user.uid), userObj);
    } catch (error) {
      console.log(error);
      throw new Error("Error while adding user in firestore Database!");
    }
  };

  // Firebase function to send email
  const sendVerificationEmail = async (
    userCred: UserCredential
  ): Promise<void> => {
    await sendEmailVerification(userCred.user); // Firebase function for sending email verification to created user
    setOpenEmailSent(true); // it opens Email sent Modal
    setEmailSentTo(userCred.user.email!); // This will set the user email we have sent email in above line which we will use in dialog modal
  };

  // This function will execute on clicking signup form submit button
  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    const { fullName, email, password } = values;
    try {
      setLoading(true);

      const userCred: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // creating user using email and password in firebase
      if (!userCred) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
        setLoading(false);
        return;
      }

      // adding display name in firebase authentication profile
      await updateProfile(auth.currentUser!, {
        displayName: fullName,
      });

      await addUserToDB({ values, userCred }); // This will add user details in firestore
      await sendVerificationEmail(userCred); // Firebase email verification
      setLoading(false); // setting loading of submit button false

      toast({
        description: "Congrats! Account created account!",
      });
    } catch (error: unknown) {
      setLoading(false);
      const message = getErrorMessage(error);
      const errToShow = message.includes("auth/email-already-in-use")
        ? "Email already in use!"
        : message;
      toast({
        variant: "destructive",
        title: errToShow,
        description: "Uh oh! Something went wrong.",
      });
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
