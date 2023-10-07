import { Button } from "@/components/ui/button";
import { BsFacebook, BsGithub, BsGoogle } from "react-icons/bs";

const SocialLoginButtons = () => {
  return (
    <section>
      <div className="w-full flex sm:flex-row flex-col sm:gap-x-4 gap-y-4">
        <Button
          className="flex flex-row gap-x-3 py-6 w-full"
          variant={"outline"}
        >
          <BsGoogle style={{ fontSize: "1.5rem" }} />
          Google
        </Button>
        <Button
          className="flex flex-row gap-x-3 py-6 w-full"
          variant={"outline"}
        >
          <BsFacebook style={{ fontSize: "1.5rem" }} />
          Facebook
        </Button>
      </div>
    </section>
  );
};

export default SocialLoginButtons;
