import { redirect } from "next/navigation";
import EmailVerifiedCard from "@/components/auth/EmailVerifiedCard";
import {
  checkActionCode,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/db/firebase.config";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import User from "@/types/types.user";

type Props = {
  searchParams: {
    oobCode: string;
  };
};

const EmailVerification = async ({ searchParams }: Props) => {
  const { oobCode } = searchParams;

  if (!oobCode) {
    return redirect("/auth/signup");
  }

  const verificationInfo = await checkActionCode(auth, oobCode);

  if (!verificationInfo.data.email) {
    return redirect("/auth/signup");
  }

  const email = verificationInfo.data.email;
  const q = query(collection(db, "users"), where("email", "==", email));
  const docs = await getDocs(q);

  let dbUser: User | null = null;
  docs.forEach((doc) => {
    const d: User = doc.data() as User;
    if (d.email === verificationInfo.data.email) {
      dbUser = d;
      return;
    }
  });

  if (!dbUser) return;

  // const userCred = signInWithEmailAndPassword(auth,dbUser.)

  return (
    <div className="flex justify-center items-center w-full h-[90vh]">
      <EmailVerifiedCard email={verificationInfo.data.email} />
    </div>
  );
};

export default EmailVerification;
