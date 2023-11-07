import { Toaster } from "@/components/ui/toaster";
import ChatsBox from "@/customComponents/web/ChatsBox";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row min-h-full w-full">
      <section className="sm:min-w-[30%] sm:max-w-[400px] min-h-full">
        <ChatsBox />
      </section>
      <section className="flex flex-1 w-full">{children}</section>
      <Toaster />
    </section>
  );
}
