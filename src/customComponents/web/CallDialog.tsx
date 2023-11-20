import { CallDialogProps } from "@/types/types.miscellaneous";
import Image from "next/image";
import UserImageAvatar from "./UserImageAvatar";

type props = {
  callDialogProps: CallDialogProps;
};
const CallDialog: React.FC<props> = ({ callDialogProps }) => {
  const { callStatus, callTo, callType, calledBy, room } = callDialogProps;
  return (
    <section className="lg:max-w-[475px] md:max-w-[475px] max-w-[260px]">
      <section className="px-6 flex flex-col justify-center items-center gap-y-3 w-full">
        {callTo.photoUrl ? (
          <Image
            src={callTo.photoUrl!}
            alt="Profile Info Profile Picture"
            width={100}
            height={100}
            className="w-40 h-40 rounded-full"
          />
        ) : (
          <div
            className={`w-40 h-40 rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
          >
            {callTo.displayName[0]}
          </div>
        )}
        <h3 className="text-gray-700 dark:text-gray-300 text-4xl font-extrabold">
          {callTo.displayName}
        </h3>
      </section>
    </section>
  );
};

export default CallDialog;
