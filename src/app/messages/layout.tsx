import { Toaster } from "@/components/ui/toaster";
import ChatsBox from "@/customComponents/web/ChatsBox";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-h-[90vh] min-h-[90vh]">
      <section className="flex flex-row">
        <ChatsBox />
        {children}
      </section>
      <Toaster />
    </main>
  );
}
