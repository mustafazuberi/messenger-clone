import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
const Navbar = () => {
  return (
    <main className="min-h-[10vh] max-h-[10vh] px-4 flex flex-row justify-between items-center border-b">
      <MessengerTextAndLogo />
      <ThemeAndProfileImage />
    </main>
  );
};

export default Navbar;
