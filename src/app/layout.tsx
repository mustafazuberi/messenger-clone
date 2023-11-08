import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/providers/StoreProvider";
import Navbar from "@/customComponents/web/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Messenger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <main className="flex flex-col min-h-screen max-h-screen min-w-full">
            <section className="min-w-full">
              <Navbar />
            </section>
            <section className="flex flex-1">{children}</section>
          </main>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
