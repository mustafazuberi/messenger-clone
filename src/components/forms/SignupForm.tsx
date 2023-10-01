import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import handleSignup from "@/server-actions/auth/handleSignup";
import GenderInput from "@/components/auth/GenderInput";

const SignupForm = () => {
  return (
    <form action={handleSignup} className="w-full flex flex-col gap-y-3">
      <Input placeholder="First Name" type="text" name="firstName" />
      <Input placeholder="Last Name" type="text" name="lastName" />
      <Input placeholder="Email" type="email" name="email" />
      <Input placeholder="Password" type="password" name="password" />
      <GenderInput name="gender" />
      <Button className="mt-6" variant={"outline"}>
        Continue
      </Button>
    </form>
  );
};

export default SignupForm;
