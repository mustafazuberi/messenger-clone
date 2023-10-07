import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Link from "next/link";
import SignupForm from "@/components/forms/SignupForm";
import { TypographyH1 } from "@/components/web/TypographyH1";

const SignUp = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4">
      <section className="flex flex-col gap-y-6 w-full max-w-lg my-3 border sm:px-8 px-3 py-12">
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
      <p className="text-center">
        Already have an account?{" "}
        <Link href={"/auth/signin"} className="font-normal text-blue-600">
          Login
        </Link>
      </p>
    </main>
  );
};
