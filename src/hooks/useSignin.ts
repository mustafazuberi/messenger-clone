import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/db/firebase.config";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/store/slice/userSlice";
import { useRouter } from "next/navigation";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";
import * as z from "zod";
import formSchema from "@/schema/schema.signinform";
import fetchUserByUid from "@/services/fetchUserByUid";
import getErrorMessage from "@/services/getErrorMessage";

const useSignin = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [submitting, setIsSubmitting] = useState(false);

  const form: UseFormReturn<z.infer<typeof formSchema>> = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const showErrorToast = (message: string) => {
    toast({
      variant: "destructive",
      title: message,
    });
  };

  const handleUserError = (errorMessage: string) => {
    showErrorToast(errorMessage);
    setIsSubmitting(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      setIsSubmitting(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred) {
        handleUserError("Something went wrong!");
        return;
      }

      const dbUser = await fetchUserByUid(userCred.user.uid);
      if (!dbUser) {
        handleUserError("Something went wrong!");
        return;
      }

      if (!dbUser.emailVerified) {
        toast({
          variant: "destructive",
          title: `Your email is not verified. Please check your email at ${email}. We have sent a verification email while creating the account."`,
        });
        setIsSubmitting(false);
        return;
      }
      dispatch(updateUserDetails({ ...dbUser }));
      dispatch(setAuthenticationStatus(true));
      toast({
        description: `Welcome, ${dbUser.displayName}!`,
      });
      router.push("/messages");
    } catch (error) {
      console.log(error);
      handleUserError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, onSubmit, submitting };
};

export default useSignin;
