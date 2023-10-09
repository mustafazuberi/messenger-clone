import AuthNavbar from "@/custom-components/auth/AuthNavbar";
import SocialLoginButtons from "@/custom-components/auth/SocialLoginButtons";
import SignInForm from "@/custom-components/forms/SignInForm";
import { TypographyH1 } from "@/components/web/TypographyH1";
import Link from "next/link";

const SignIn = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4">
      <section className="flex flex-col gap-y-6 w-full max-w-lg my-3 border sm:px-8 px-3 py-12">
        <TypographyH1 text="Sign In" />
        <SignInForm />
        <SocialLoginButtons />
        <DontHaveAnAccount />
      </section>
    </main>
  );
};

export default SignIn;

const DontHaveAnAccount = () => {
  return (
    <main>
      <section className="w-full flex flex-col gap-y-3">
        <p className="text-center">
          Don't have an account?{" "}
          <Link href={"/auth/signup"} className="font-normal text-blue-600">
            Create Account
          </Link>
        </p>
      </section>
    </main>
  );
};
