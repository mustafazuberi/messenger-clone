import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/providers/StoreProvider";
import Navbar from "@/customComponents/web/Navbar";
import ChatsBox from "@/customComponents/web/ChatsBox";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <StoreProvider>
        <main className="flex flex-row max-h-[90vh] min-h-[90vh]">
          <ChatsBox />
          {children}
        </main>
        <Toaster />
      </StoreProvider>
    </main>
  );
}
