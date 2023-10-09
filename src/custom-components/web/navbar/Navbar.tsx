import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
const Navbar = () => {
  return (
    <main className="py-2 px-4 flex flex-row justify-between items-center border-b">
      <MessengerTextAndLogo />
      <ThemeAndProfileImage />
    </main>
  );
};

export default Navbar;
