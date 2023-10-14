import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

const Requests = () => {
  return (
    <main className="flex flex-col justify-between p-2 w-full gap-y-3">
      <RequestsNav />
    </main>
  );
};

export default Requests;

const RequestsNav = () => {
  return (
    <section className="flex flex-row justify-between items-center w-full mt-2">
      <section className="flex flex-row gap-x-2 items-center">
        <section>
          <Link href={"/"}>
            <BiArrowBack className="cursor-pointer text-2xl" />
          </Link>
        </section>
        <section>
          <h3 className="text-2xl font-bold">Requests</h3>
        </section>
      </section>
      <section className="flex flex-row gap-x-2 items-center">
        <span className="text-[12px] bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
          Sent Requests
        </span>
      </section>
    </section>
  );
};
