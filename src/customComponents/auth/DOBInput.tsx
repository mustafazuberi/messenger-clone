import { SelectDate } from "./SelectDate";

const DOBInput = ({ name }: { name?: string }) => {
  return (
    <section>
      <h4 className="font-extralight text-[15px] text-black">Select DOB</h4>
      <SelectDate className="w-full" />
    </section>
  );
};

export default DOBInput;
