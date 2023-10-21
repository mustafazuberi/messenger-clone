import {
  RegisterOptions,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";
import UpdateDOB from "./_components/UpdateDOB";
import UpdateFullname from "./_components/UpdateFullname";
import UpdateGender from "./_components/UpdateGender";
import UpdateProfilePhoto from "./_components/UpdateProfilePhoto";

const page = () => {
  return (
    <main className="mt-6 flex flex-col gap-y-8">
      <UpdateProfilePhoto />
      <UpdateFullname />
      <UpdateGender />
      <UpdateDOB />
    </main>
  );
};

export default page;
