import SocialLoginButtons from "@/customComponents/auth/SocialLoginButtons";
import SignupForm from "@/customComponents/forms/SignupForm";
import { TypographyH1 } from "@/customComponents/web/TypographyH1";
import Link from "next/link";

const SignUp = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4 mt-4 min-w-full">
      <section className="flex flex-col gap-y-6 w-full max-w-lg my-3 border lg:px-8 md:px-8 px-3 py-12 ">
        <TypographyH1 text="Create an account" />
        <SignupForm />
        <SocialLoginButtons />
        <AlreadyHaveAnAccount />
      </section>
    </main>
  );
};

export default SignUp;

const AlreadyHaveAnAccount = () => {
  return (
    <main>
      <p className="text-center text-gray-700 dark:text-gray-300">
        Already have an account?{" "}
        <Link
          prefetch
          href={"/auth/signin"}
          className="font-normal text-blue-600"
        >
          Login
        </Link>
      </p>
    </main>
  );
};
