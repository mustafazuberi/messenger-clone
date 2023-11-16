import Image from "next/image";
import messengerLogo from "@/../assets/images/messengerlogo.png";
import { useRouter } from "next/navigation";

const MessengerTextAndLogo = () => {
  const router = useRouter();
  return (
    <section
      className="flex flex-row items-center gap-x-2 cursor-pointer"
      onClick={() => router.push("/messages")}
    >
      <Image
        src={messengerLogo}
        alt="messenger logo"
        width={40}
        height={40}
        className="lg:w-10 md:w-10 lg:h-10 md:h-10 h-8 w-8"
      />
      <h1 className="font-medium text-[21px] lg:flex md:flex hidden bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
        Messenger
      </h1>
    </section>
  );
};

export default MessengerTextAndLogo;
