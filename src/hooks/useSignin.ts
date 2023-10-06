import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/db/firebase.config";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "@/store/slice/userSlice";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import * as z from "zod";
import formSchema from "@/schema/schema.signinform";
import User from "@/types/types.user";
import fetchUserByUid from "@/services/firebase-firestore/fetchUserByUid";
import { useState } from "react";

const useSignin = () => {
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
      if (!userCred) {
        throw new Error("Error in Sign in function");
        setLoading(false);
        return;
      }

      const dbUser: User | null = await fetchUserByUid(userCred.user.uid);
      if (!dbUser) {
        throw new Error("Error in Sign in function");
        setLoading(false);
        return;
      }

      dispatch(updateUserDetails({ ...dbUser }));
      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log(error);
      throw new Error("Error in Sign in function");
      setLoading(false);
    }
  }
  return { form, onSubmit, loading };
};

export default useSignin;
