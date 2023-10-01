import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const SignInForm = () => {
  return (
    <form className="w-full flex flex-col gap-y-3">
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Button className="mt-6" variant={"outline"}>
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;
