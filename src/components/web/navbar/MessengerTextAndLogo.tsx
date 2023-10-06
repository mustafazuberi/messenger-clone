import Image from "next/image";
import messengerLogo from "@/../assets/images/messengerlogo.png";
const MessengerTextAndLogo = () => {
  return (
    <div className="flex flex-row items-center gap-x-2">
        <Image
          src={messengerLogo}
          alt="messenger logo"
          width={35}
          height={35}
        />
        <h1 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          Messenger
        </h1>
      </div>
  )
}

export default MessengerTextAndLogo