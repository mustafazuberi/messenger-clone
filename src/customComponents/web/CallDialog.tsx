import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useAudioCall from "@/hooks/useAudioCall";
import { RootState } from "@/store";
import { CALL_STATUS } from "@/types/types.call";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ImPhoneHangUp } from "react-icons/im";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const CallDialog = () => {
  const { activeCall } = useSelector((state: RootState) => state.calls);
  const currentUser = useSelector((state: RootState) => state.currentUser);

  const { handleAudioCall, handleMissedCall } = useAudioCall();

  // This useEffect will for peer conection and audio call of two users will run when status updated to ongoing
  useEffect(() => {
    if (activeCall?.callStatus === CALL_STATUS.ONGOING) handleAudioCall();
  }, [activeCall, activeCall?.callStatus]);

  // This use Effect will set Active call to missed in firebase after 10 seconds of calling and update active call to null
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (activeCall?.callStatus === CALL_STATUS.CALLING) {
      timeoutId = setTimeout(() => handleMissedCall(), 30000);
    }
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeCall?.callStatus, handleMissedCall]);

  const renderProfilePicture = () => {
    if (activeCall?.toUser.photoUrl) {
      return (
        <Image
          src={activeCall?.toUser.photoUrl!}
          alt="Profile Info Profile Picture"
          width={100}
          height={100}
          className="w-40 h-40 rounded-full"
        />
      );
    } else {
      return (
        <div
          className={`w-40 h-40 rounded-full flex justify-center items-center border text-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400`}
        >
          {activeCall?.toUser.displayName[0]}
        </div>
      );
    }
  };

  const renderCallStatus = () => {
    if (activeCall?.callStatus === CALL_STATUS.ONGOING) {
      return (
        activeCall.callTime?.started && (
          <Timer startTime={activeCall.callTime.started} />
        )
      );
    } else {
      return (
        <h6>
          {activeCall?.callStatus === CALL_STATUS.CALLING &&
          activeCall?.from === currentUser.uid
            ? "Calling..."
            : activeCall?.callStatus === CALL_STATUS.CALLING
            ? "Ringing"
            : activeCall?.callStatus === CALL_STATUS.CANCELLED
            ? "Call Canceled"
            : activeCall?.answered &&
              activeCall?.callStatus === CALL_STATUS.DONE
            ? "Call Done"
            : activeCall?.callStatus === CALL_STATUS.MISSED
            ? "Missed Call"
            : !activeCall?.answered && "Rejected"}
        </h6>
      );
    }
  };

  return (
    <div>
      <section>
        <Dialog open={!!activeCall}>
          <DialogContent hideCrossBtn={true}>
            <section className="min-w-full max-w-full h-screen">
              <section className="px-6 flex flex-col justify-between items-center gap-y-4 min-h-[80vh]">
                <section className="flex flex-col gap-y-3 flex-1 w-full justify-center items-center">
                  {renderProfilePicture()}
                  <section className="flex flex-col justify-center items-center">
                    <h3 className="text-gray-700 dark:text-gray-300 text-4xl font-extrabold">
                      {activeCall?.toUser.displayName}
                    </h3>
                    {renderCallStatus()}
                  </section>
                </section>
                <AudioCallButtons />
              </section>

              {activeCall?.callStatus === CALL_STATUS.CALLING && (
                <audio
                  src="https://www.soundjay.com/phone/phone-calling-1.mp3"
                  autoPlay
                  loop
                />
              )}
            </section>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
};

export default CallDialog;

export const Timer: React.FC<{ startTime: number }> = ({ startTime }) => {
  const calculateTimeDifference = () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - startTime;

    if (timeDifference >= 0) {
      // Calculate the elapsed time since the start time
      const elapsedSeconds = Math.floor(timeDifference / 1000);
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      const elapsedHours = Math.floor(elapsedMinutes / 60);
      const elapsedDays = Math.floor(elapsedHours / 24);

      setDays(elapsedDays);
      setHours(elapsedHours % 24);
      setMinutes(elapsedMinutes % 60);
      setSeconds(elapsedSeconds % 60);
    } else {
      // Timer hasn't started yet, calculate time until start
      const remainingTime = Math.abs(timeDifference);
      const remainingSeconds = Math.floor(remainingTime / 1000);
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingDays = Math.floor(remainingHours / 24);

      setDays(remainingDays);
      setHours(remainingHours % 24);
      setMinutes(remainingMinutes % 60);
      setSeconds(remainingSeconds % 60);
    }
  };

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => calculateTimeDifference(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h6>
      {days} : {hours} : {minutes} : {seconds}
    </h6>
  );
};

const AudioCallButtons = () => {
  const { activeCall } = useSelector((state: RootState) => state.calls);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { handleOnRejectCall, handleOnCancelCall } = useAudioCall();

  const closeButton = (
    <Button
      variant={"destructive"}
      className="bg-red-700 animate-pulse w-[65px] h-[65px] rounded-full flex justify-center items-center cursor-pointer"
      onClick={handleOnRejectCall}
    >
      <IoCloseCircleSharp className="text-white text-3xl" />
    </Button>
  );

  const rejectButton = (
    <Button
      variant={"destructive"}
      className="bg-red-700 animate-pulse w-[65px] h-[65px] rounded-full flex justify-center items-center cursor-pointer"
      onClick={handleOnRejectCall}
    >
      <ImPhoneHangUp className="text-white text-3xl" />
    </Button>
  );

  const cancelButton = (
    <Button
      variant={"destructive"}
      className="bg-red-700 animate-pulse w-[65px] h-[65px] rounded-full flex justify-center items-center cursor-pointer"
      onClick={handleOnCancelCall}
    >
      <ImPhoneHangUp className="text-white text-3xl" />
    </Button>
  );

  const acceptButton = (
    <Button
      variant={"destructive"}
      className="bg-green-900 hover:bg-green-950 animate-pulse w-[65px] h-[65px] rounded-full flex justify-center items-center cursor-pointer"
    >
      <ImPhoneHangUp className="text-white text-3xl" />
    </Button>
  );

  const callAgainButton = (
    <Button
      variant={"destructive"}
      className="bg-green-900 hover:bg-green-950 animate-pulse w-[65px] h-[65px] rounded-full flex justify-center items-center cursor-pointer"
    >
      <ImPhoneHangUp className="text-white text-3xl" />
    </Button>
  );

  return (
    <section>
      {/* If current user is calling cancel call button */}
      {activeCall?.from === currentUser.uid &&
        activeCall.callStatus === CALL_STATUS.CALLING &&
        cancelButton}

      {/* If current user is receiveng Reject and accept button */}
      {activeCall?.callStatus === CALL_STATUS.CALLING &&
        !(activeCall?.from === currentUser.uid) && (
          <section className="flex flex-row w-full justify-center gap-x-3">
            {rejectButton}
            {acceptButton}
          </section>
        )}
    </section>
  );
};
