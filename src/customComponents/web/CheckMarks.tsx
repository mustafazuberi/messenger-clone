import { IoCheckmarkDoneSharp } from "react-icons/io5";

export const TwoCheck = ({ seen }: { seen: boolean }) => {
  return (
    <section className="flex flex-col justify-end items-end">
      <IoCheckmarkDoneSharp
        className={`${
          seen ? "text-[#2c90a0]" : "text-gray-300"
        } relative font-extrabold top-1`}
      />
    </section>
  );
};
