import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/providers/StoreProvider";
import Navbar from "@/custom-components/web/navbar/Navbar";

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
          <main>
            <Navbar />
            {children}
          </main>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
