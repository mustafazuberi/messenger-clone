import { Dialog, DialogContent } from "@/components/ui/dialog";
import useAudioCall from "@/hooks/useAudioCall";
import { RootState } from "@/store";
import { CALL_STATUS } from "@/types/types.call";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import AudioCallButtons from "./CallDialogButtons";
import AudioCalTimer from "./AudioCalTimer";

const CallDialog = () => {
  const activeCall = useSelector((state: RootState) => state.calls.activeCall);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const callUser =
    activeCall?.from === currentUser.uid
      ? activeCall.toUser
      : activeCall?.fromUser;

  const {
    handleMissedCall,
    pc,
    localRef,
    remoteRef,
    myStream,
    remoteStream,
    setRemoteStream,
  } = useAudioCall();

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

  // For Web rtc stream
  useEffect(() => {
    if (localRef.current && myStream) {
      localRef.current.srcObject = myStream;
      console.log(myStream);
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  //

  const renderProfilePicture = () => {
    if (activeCall?.toUser.photoUrl) {
      return (
        <Image
          src={callUser?.photoUrl!}
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
          {callUser?.displayName[0]}
        </div>
      );
    }
  };

  const renderCallStatus = () => {
    if (activeCall?.callStatus === CALL_STATUS.ONGOING) {
      return (
        activeCall.callTime?.started && (
          <AudioCalTimer startTime={activeCall.callTime.started} />
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
            <section className="min-w-full max-w-full sm:h-[90vh] h-screen">
              <section className="px-6 flex flex-col justify-between items-center gap-y-4 min-h-[80vh]">
                <section className="flex flex-col gap-y-3 flex-1 w-full justify-center items-center">
                  {renderProfilePicture()}
                  <section className="flex flex-col justify-center items-center">
                    <h3 className="text-gray-700 dark:text-gray-300 text-4xl font-extrabold">
                      {callUser?.displayName}
                    </h3>
                    {renderCallStatus()}
                  </section>
                </section>
                {/* Call */}
                <section className="flex flex-row">
                  <video
                    ref={localRef}
                    autoPlay
                    playsInline
                    controls
                    className="w-[180px] h-[200px]"
                  />
                  <video
                    ref={remoteRef}
                    autoPlay
                    playsInline
                    controls
                    className="w-[150px] h-[200px]"
                  />
                </section>
                {/*  */}
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
