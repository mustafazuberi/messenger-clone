import { RootState } from "@/store";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const useProtectedRouting = () => {
  const pathName = usePathname();
  const isAuthenticated = useSelector(
    (state: RootState) => state.authenticationStatus
  );

  const handleProtectedRouting = useCallback(() => {
    const protectedRoutes = ["/messages", "profile/settings"];
    const publicRoutes = [
      "/auth/signin",
      "/auth/signup",
      "/auth/emailVerification",
    ];
    if (!isAuthenticated && protectedRoutes.includes(pathName)) {
      return redirect("/auth/signin");
    }
    if (isAuthenticated && publicRoutes.includes(pathName)) {
      return redirect("/messages");
    }
  }, [isAuthenticated, pathName]);

  return { handleProtectedRouting };
};

export default useProtectedRouting;
