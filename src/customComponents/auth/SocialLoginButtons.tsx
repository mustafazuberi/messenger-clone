"use client";
import { Button } from "@/components/ui/button";
import { BsFacebook, BsGoogle } from "react-icons/bs";
import useSignup from "@/hooks/useSignup";
import React from "react";

const SocialLoginButtons = () => {
  const { continueWithGoogle, continueWithFacebook } = useSignup();
  return (
    <section>
      <div className="w-full flex lg:flex-row md:flex-row flex-col lg:gap-x-4 md:gap-x-4 gap-y-4">
        <Button
          className="flex flex-row gap-x-3 py-6 w-full"
          variant={"outline"}
          onClick={continueWithGoogle}
        >
          <BsGoogle
            style={{ fontSize: "1.5rem" }}
            className="text-gray-700 dark:text-gray-300"
          />
          Google
        </Button>
        <Button
          className="flex flex-row gap-x-3 py-6 w-full"
          variant={"outline"}
          onClick={continueWithFacebook}
        >
          <BsFacebook
            style={{ fontSize: "1.5rem" }}
            className="text-gray-700 dark:text-gray-300"
          />
          Facebook
        </Button>
      </div>
    </section>
  );
};

export default SocialLoginButtons;
