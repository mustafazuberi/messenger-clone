import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/db/firebase.config";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/store/slice/userSlice";
import { useRouter } from "next/navigation";
import * as z from "zod";
import formSchema from "@/schema/schema.signinform";
import User from "@/types/types.user";
import fetchUserByUid from "@/services/firebase-firestore/fetchUserByUid";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { setAuthenticationStatus } from "@/store/slice/authenticationStatusSlice";

const useSignin = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      if (!userCred.user.emailVerified) {
        toast({
          variant: "destructive",
          title: `Your email is not verified. Please check your email at ${email} We have sent a verification email while creating the account."`,
        });
        setLoading(false);
        return;
      }

      if (!userCred) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
        setLoading(false);
        return;
      }

      const dbUser: User | null = await fetchUserByUid(userCred.user.uid);
      if (!dbUser) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
        setLoading(false);
        return;
      }

      dispatch(updateUserDetails({ ...dbUser }));
      dispatch(setAuthenticationStatus(true));
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return { form, onSubmit, loading };
};

export default useSignin;
