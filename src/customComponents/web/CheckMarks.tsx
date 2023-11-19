import React from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const TwoCheck = React.memo(({ seen }: { seen: boolean }) => {
  return (
    <section className="flex flex-col justify-end items-end">
      <IoCheckmarkDoneSharp
        className={`${
          seen ? "text-[#2c90a0]" : "text-gray-300"
        } relative font-extrabold top-1`}
      />
    </section>
  );
});

export default TwoCheck;
