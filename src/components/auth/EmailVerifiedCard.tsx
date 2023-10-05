import Image from "next/image";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import messegerLogo from "@/../assets/images/messengerlogo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmailVerifiedCard = ({ email }: { email: string }) => {
  return (
    <div className="w-full sm:max-w-[475px] max-w-[260px] py-6 flex flex-col gap-y-4 justify-center items-center border-b border-gray-400">
      <Image width={100} height={100} src={messegerLogo} alt="messenger logo" />
      <h1 className="text-[28px] font-mono text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
        Congratulations Your Email , {email} is verified!
      </h1>
      <RiVerifiedBadgeFill className="w-16 h-16 text-green-700" />
      <Link href={"/auth/signin"}>
        <Button className="px-16" variant={"default"}>
          Sign In
        </Button>
      </Link>
    </div>
  );
};

export default EmailVerifiedCard;
