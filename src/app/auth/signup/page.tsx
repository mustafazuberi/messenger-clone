import AuthNavbar from "@/components/auth/AuthNavbar";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Link from "next/link";
import SignupForm from "@/components/forms/SignupForm";

const SignUp = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4">
      <section className="flex flex-col gap-y-6 w-full max-w-xl my-12">
        <AuthNavbar />
        <SignupForm />
        <SocialLoginButtons usedOn="signup" />
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
