import { Button } from "@/components/ui/button";
import { CallDialogProps } from "@/types/types.miscellaneous";
import Image from "next/image";
import { ImPhoneHangUp } from "react-icons/im";

type props = {
  callDialogProps: CallDialogProps;
  setCallDialog: (val: CallDialogProps | null) => void;
};
const CallDialog: React.FC<props> = ({ callDialogProps, setCallDialog }) => {
  const { callStatus, callTo, callType, calledBy, room } = callDialogProps;

  const handleAudioCallHangup = () => {
    setCallDialog(null);
  };

  return (
    <section className="lg:max-w-[475px] md:max-w-[475px] max-w-[260px]">
      <section className="px-6 flex flex-col justify-between items-center gap-y-4 min-h-[80vh]">
        <section className="flex flex-col gap-y-3 flex-1 w-full justify-center items-center">
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
          <section className="flex flex-col justify-center items-center">
            <h3 className="text-gray-700 dark:text-gray-300 text-4xl font-extrabold">
              {callTo.displayName}
            </h3>
            {callStatus === "connecting" ? <h6>Calling...</h6> : <h6></h6>}
          </section>
        </section>
        <Button
          variant={"destructive"}
          className="bg-red-700 py-1 w-full rounded-[2px] flex justify-center items-center cursor-pointer"
          onClick={handleAudioCallHangup}
        >
          <ImPhoneHangUp className="text-white text-3xl" />
        </Button>
      </section>
      {callStatus === "connecting" && (
        <audio
          src="https://www.soundjay.com/phone/phone-calling-1.mp3"
          autoPlay
          loop
        />
      )}
    </section>
  );
};

export default CallDialog;
