"use client";
import React from "react";
import Image from "next/image";
import messengerLogo from "@/../assets/images/messengerlogo.png";
import { TypographyH1 } from "../web/TypographyH1";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EmailSentDialog = ({ email }: { email: string }) => {
  return (
    <section className="lg:max-w-[475px] md:max-w-[475px] max-w-[260px]">
      <section className="py-6 flex flex-col gap-y-6">
        <section className="w-full flex flex-col justify-center items-center gap-y-8  ">
          <Image
            src={messengerLogo}
            alt="envelopeMailImage"
            loading="eager"
            className="lg:w-24 md:w-24 lg:h-24 md:h-24 w-16 h-16"
          />
          <TypographyH1 text="Email Confirmation" />
        </section>
        <section>
          <p className="text-gray-700 dark:text-gray-300">
            We have sent email to
            <span className="text-blue-500"> {email} </span>
            to confirm the validity of our email address. After receiving the
            email follow the link provided to complete your registration.
          </p>
          <section className="flex justify-center items-center mt-3">
            <Link href={"/auth/signin"} prefetch>
              <Button>Sign In</Button>
            </Link>
          </section>
        </section>
      </section>
    </section>
  );
};

export default EmailSentDialog;
