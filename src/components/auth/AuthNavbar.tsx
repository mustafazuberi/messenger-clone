import messengerLogo from "@/../assets/images/messengerlogo.png";
import Image from "next/image";

const AuthNavbar = () => {
  return (
    <section className="flex flex-col w-full justify-center items-center gap-y-5">
      <Image src={messengerLogo} alt="messenger logo" width={65} height={65} />
      <h1 className="font-extralight text-4xl text-black">Messenger</h1>
    </section>
  );
};

export default AuthNavbar;
