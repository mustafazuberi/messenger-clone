"use client";

import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  UserCredential,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/db/firebase.config";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import formSchema from "@/schema/schema.signupForm";

type AuthDetails = {
  fullName: string;
  email: string;
  gender: string;
  password: string;
  userCred: UserCredential;
};

const useSignup = () => {
  const [openEmailSent, setOpenEmailSent] = React.useState<boolean>(false);
  const [emailSentTo, setEmailSentTo] = React.useState<string>("");
  const [loading, setLoading] = useState(false);

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

  const addUserToDB = async (authDetails: AuthDetails) => {
    try {
      console.log(authDetails);
    } catch (error) {
      console.log(error);
    }
  };

  // This function will execute on clicking signup form submit button
  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    const { fullName, email, gender, password } = values;
    try {
      setLoading(true);
      // creating user using email and password in firebase
      const userCred: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCred) return;

      await sendEmailVerification(userCred.user); // Firebase function for sending email verification to created user
      setOpenEmailSent(true); // it opens Email sent Modal
      setEmailSentTo(userCred.user.email!); // This will set the user email we have sent email in above line which we will use in dialog modal
      setLoading(false);

      await addUserToDB({
        fullName,
        email,
        gender,
        password,
        userCred,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
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
