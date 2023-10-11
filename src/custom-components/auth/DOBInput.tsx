import { SelectDate } from "@/custom-components/auth/SelectDate";
import React from "react";

type Props = {
  name?: string;
};

const DOBInput = ({ name }: Props) => {
  return (
    <section>
      <h4 className="font-extralight text-[15px] text-black">Select DOB</h4>
      <SelectDate className="w-full" />
    </section>
  );
};

export default DOBInput;
