import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AiOutlineCloudDownload } from "react-icons/ai";
import useSendMessage from "@/hooks/useSendMessage";
import TailwindSpinner from "./TailwindSpinner";
import { Button } from "@/components/ui/button";

const SendImageModal = () => {
  const {
    sendImageFile,
    getInputProps,
    getRootProps,
    sendImageLoading,
    sendImageUrl,
    sendingImage,
    handleSendImage,
  } = useSendMessage();
  return (
    <main>
      <DialogContent>
        <section className="pt-4">
          {!sendImageFile && !sendImageLoading && (
            <section
              {...getRootProps()}
              className="min-h-[300px] mt-4  flex flex-col justify-center items-center border-dotted border-2 cursor-pointer "
            >
              <input {...getInputProps()} type="file" accept="image/*" />
              <section className="flex flex-col justify-center items-center">
                <AiOutlineCloudDownload className="text-[70px]" />
                Drag and drop files here or click to browse.
              </section>
            </section>
          )}
          {sendImageLoading ? (
            <section className="min-h-[300px] flex flex-row justify-center items-center">
              <TailwindSpinner />
            </section>
          ) : (
            sendImageFile && (
              <section className="w-full mt-4 max-h-[400px] overflow-auto overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-thumb-rounded-[10px] scrollbar-track-inherit">
                <img src={sendImageUrl} className="h-auto" />
              </section>
            )
          )}
        </section>
        <DialogFooter>
          <Button
            className="px-4 mt-6"
            disabled={sendingImage}
            onClick={handleSendImage}
          >
            {sendingImage ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </main>
  );
};

export default SendImageModal;
