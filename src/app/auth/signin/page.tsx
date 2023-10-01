import AuthNavbar from "@/components/auth/AuthNavbar";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import SignInForm from "@/components/forms/SignInForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4">
      <section className="flex flex-col gap-y-6 w-full max-w-xl my-12">
        <AuthNavbar />
        <SignInForm />
        <SocialLoginButtons usedOn="login" />
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
