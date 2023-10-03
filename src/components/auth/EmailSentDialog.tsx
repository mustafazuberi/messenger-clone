"use client";
import { Dialog, DialogContentWithoutX } from "@/components/ui/dialog";
import Image from "next/image";
import messengerLogo from "@/../assets/images/messengerlogo.png";

type Props = {
  openEmailSent: boolean;
  email: string;
};

const EmailSentDialog = ({ openEmailSent, email }: Props) => {
  return (
    <Dialog open={openEmailSent}>
      <DialogContentWithoutX className="sm:max-w-[475px] max-w-[260px]">
        <section className="py-6 flex flex-col gap-y-6">
          <section className="w-full flex flex-col justify-center items-center gap-y-8  ">
            <Image
              src={messengerLogo}
              alt="envelopeMailImage"
              width={100}
              height={100}
            />
            <h1 className="text-[#393939] font-medium text-2xl">
              Email Confirmation
            </h1>
          </section>
          <section>
            <p>
              We have sent email to
              <span className="text-blue-500"> {email} </span>
              to confirm the validity of our email address. After receiving the
              email follow the link provided to complete your registration.
            </p>
          </section>
        </section>
      </DialogContentWithoutX>
    </Dialog>
  );
};

export default EmailSentDialog;
