import { redirect } from "next/navigation";
import EmailVerifiedCard from "@/components/auth/EmailVerifiedCard";
import { checkActionCode } from "firebase/auth";
import { auth } from "@/db/firebase.config";

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
  console.log(verificationInfo);

  if (!verificationInfo.data.email) {
    return redirect("/auth/signup");
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <EmailVerifiedCard email={verificationInfo.data.email} />
    </div>
  );
};

export default EmailVerification;
