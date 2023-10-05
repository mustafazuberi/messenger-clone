import * as z from "zod";
import formSchema from "@/schema/schema.signinform";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, UserInfo } from "firebase/auth";
import { auth } from "@/db/firebase.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateUserDetails } from "@/store/slice/userSlice";
import { redirect } from "next/navigation";
import User from "@/types/types.user";

const useSignin = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const globalState = useSelector((state: RootState) => state);

  const fetchUserByUid = async (uid: string): Promise<"User"> => {
    return "User";
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (!userCred) return;

      const dbUser = await fetchUserByUid(userCred.user.uid);

      redirect("/");
    } catch (error) {
      console.log(error);
      throw new Error("Error in Sign in function");
    }
  }
  return { form, onSubmit };
};

export default useSignin;
