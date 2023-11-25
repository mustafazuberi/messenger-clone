import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmailVerifiedCard = ({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) => {
  return (
    <div className="w-full lg:max-w-[475px] md:max-w-[475px] max-w-[260px] py-6 flex flex-col gap-y-4 justify-center items-center border-b border-gray-400">
      <h1 className="font-extrabold tracking-tight lg:text-3xl md:text-3xl text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
        Congratulations {displayName}! Your email, {email} is verified!
      </h1>
      <RiVerifiedBadgeFill className="w-16 h-16 text-green-700" />
      <Link prefetch href={"/auth/signin"} >
        <Button className="px-16" variant={"outline"}>
          Sign In
        </Button>
      </Link>
    </div>
  );
};

export default EmailVerifiedCard;
