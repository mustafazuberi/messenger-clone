"use client";

import React, { SetStateAction, useState } from "react";
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

type HookProps = {
  setOpenEmailSent?: React.Dispatch<SetStateAction<boolean>>;
};

const useSignup = ({ setOpenEmailSent }: HookProps) => {
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

  const handleEmailSentModal = (userEmail: string) => {
    if (setOpenEmailSent) {
      console.log("opening modal");
      setOpenEmailSent(true); // it opens Email sent Modal
      setEmailSentTo(userEmail); // This will set the user email we have sent email in above line which we will use in dialog modal
    }
  };

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

      await sendEmailVerification(userCred.user); // Firebase function for sending email verification to created user
      handleEmailSentModal(userCred.user.email!); //Opens Modal
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
    }
  }

  return { form, onSubmit, emailSentTo, loading };
};

export default useSignup;
