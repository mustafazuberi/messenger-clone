"use client";
import { Button } from "@/components/ui/button";
import { BsFacebook, BsGoogle } from "react-icons/bs";
import useSignup from "@/hooks/useSignup";

const SocialLoginButtons = () => {
  const { continueWithGoogle, continueWithFacebook } = useSignup();
  return (
    <section>
      <div className="w-full flex sm:flex-row flex-col sm:gap-x-4 gap-y-4">
        <Button
          className="flex flex-row gap-x-3 py-6 w-full"
          variant={"outline"}
          onClick={continueWithGoogle}
        >
          <BsGoogle style={{ fontSize: "1.5rem" }} />
          Google
        </Button>
        <Button
          className="flex flex-row gap-x-3 py-6 w-full"
          variant={"outline"}
          onClick={continueWithFacebook}
        >
          <BsFacebook style={{ fontSize: "1.5rem" }} />
          Facebook
        </Button>
      </div>
    </section>
  );
};

export default SocialLoginButtons;
