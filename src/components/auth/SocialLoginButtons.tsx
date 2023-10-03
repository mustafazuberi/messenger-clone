import { Button } from "@/components/ui/button";
import { BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";

type Props = {
  usedOn: string;
};

const SocialLoginButtons = ({ usedOn }: Props) => {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <h4 className="text-center">Or</h4>
      <Button className="flex flex-row gap-x-3 w-full">
        <BsGoogle style={{ fontSize: "1.5rem" }} />
        {usedOn === "signup" ? "Continue" : "Login"} with Google
      </Button>
      <Button className="flex flex-row gap-x-3 w-full">
        <BsFacebook style={{ fontSize: "1.5rem" }} />
        {usedOn === "signup" ? "Continue" : "Login"} with Facebook
      </Button>
      <Button className="flex flex-row gap-x-3 w-full">
        <BsGithub style={{ fontSize: "1.5rem" }} />
        {usedOn === "signup" ? "Continue" : "Login"} with Github
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
