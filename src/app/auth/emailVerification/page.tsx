import { redirect } from "next/navigation";
import { checkActionCode } from "firebase/auth";
import { auth, db } from "@/db/firebase.config";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import User from "@/types/types.user";
import EmailVerifiedCard from "@/customComponents/auth/EmailVerifiedCard";

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
  const verfUsers = await getDocs(q);

  let verifiedUserName: string = "";
  verfUsers.forEach((vfUserDoc) => {
    const d: User = vfUserDoc.data() as User;
    if (d.email === verificationInfo.data.email) {
      const ref = doc(db, "users", vfUserDoc.id);
      updateDoc(ref, {
        emailVerified: true,
      });
      verifiedUserName = d.displayName;
      return;
    }
  });

  return (
    <div className="flex justify-center items-center w-full h-[90vh]">
      <EmailVerifiedCard
        email={verificationInfo.data.email}
        displayName={verifiedUserName}
      />
    </div>
  );
};

export default EmailVerification;
