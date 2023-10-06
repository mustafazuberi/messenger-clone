import MessengerTextAndLogo from "./MessengerTextAndLogo";
import ThemeAndProfileImage from "./ThemeAndProfileImage";
const Navbar = () => {
  return (
    <main className="p-6 flex flex-row justify-between items-center">
      <MessengerTextAndLogo />
      <ThemeAndProfileImage />
    </main>
  );
};

export default Navbar;
