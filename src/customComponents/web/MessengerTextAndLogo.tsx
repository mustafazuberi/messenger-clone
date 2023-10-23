import Image from "next/image";
import messengerLogo from "@/../assets/images/messengerlogo.png";
import Link from "next/link";
const MessengerTextAndLogo = () => {
  return (
    <Link href={"/messages"} className="cursor-pointer">
      <div className="flex flex-row items-center gap-x-2">
        <Image
          src={messengerLogo}
          alt="messenger logo"
          width={35}
          height={35}
        />
        <h1 className="font-medium text-[21px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          Messenger
        </h1>
      </div>
    </Link>
  );
};

export default MessengerTextAndLogo;
