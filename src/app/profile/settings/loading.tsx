import TailwindSpinner from "@/customComponents/web/TailwindSpinner";

export default function Loading() {
  return (
    <main className="flex flex-col min-h-[90vh] border border-white items-center justify-center gap-y-3 ">
      <TailwindSpinner />
      <h3 className="text-2xl font-medium">Loading...</h3>
    </main>
  );
}
