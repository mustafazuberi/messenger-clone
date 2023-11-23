import { Button } from "@/components/ui/button";
import useAudioCall from "@/hooks/useAudioCall";
import { RootState } from "@/store";
import { CALL_STATUS } from "@/types/types.call";
import { ImPhoneHangUp } from "react-icons/im";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const AudioCallButtons = () => {
  const { activeCall } = useSelector((state: RootState) => state.calls);
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const {
    handleOnRejectCall,
    handleOnCancelCall,
    handleOnReceiveCall,
  } = useAudioCall();

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
      onClick={handleOnReceiveCall}
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

export default AudioCallButtons;
