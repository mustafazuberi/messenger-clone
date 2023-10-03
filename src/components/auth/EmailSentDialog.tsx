"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import envelopeMailImage from "@/../assets/images/emailsentenvelop.png";
import React, { SetStateAction } from "react";

type Props = {
  openEmailSent: boolean;
  setOpenEmailSent: React.Dispatch<SetStateAction<boolean>>;
  email: string;
};

const EmailSentDialog = ({ openEmailSent, setOpenEmailSent, email }: Props) => {
  console.log("emailSentTo----", email);
  return (
    <main>
      <Dialog open={openEmailSent} onOpenChange={setOpenEmailSent}>
        <DialogContent className="sm:max-w-[425px] max-w-[260px]">
          <section className="py-6 flex flex-col gap-y-6">
            <section className="w-full flex flex-col justify-center items-center gap-y-4">
              <Image
                src={envelopeMailImage}
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
                to confirm the validity of our email address. After receiving
                the email follow the link provided to complete your
                registration.
              </p>
            </section>
          </section>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default EmailSentDialog;
