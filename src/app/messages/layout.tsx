import { Toaster } from "@/components/ui/toaster";
import ChatPageWrapper from "@/customComponents/web/ChatPageWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <ChatPageWrapper children={children} />
      <Toaster />
    </main>
  );
}
