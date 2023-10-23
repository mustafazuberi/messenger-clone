import { Toaster } from "@/components/ui/toaster";
import ChatsBox from "@/customComponents/web/ChatsBox";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="flex flex-row max-h-[90vh] min-h-[90vh]">
        <ChatsBox />
        {children}
      </section>
      <Toaster />
    </main>
  );
}
