import TailwindSpinner from "@/custom-components/web/modals/TailwindSpinner";

export default function Loading() {
  return (
    <main className="flex flex-col min-h-[90vh] items-center justify-center gap-y-3 ">
      <TailwindSpinner />
      <h3 className="text-2xl font-medium">Loading...</h3>
    </main>
  );
}
