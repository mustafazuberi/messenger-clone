import AddBio from "./_components/AddBio";
import UpdateDOB from "./_components/UpdateDOB";
import UpdateFullname from "./_components/UpdateFullname";
import UpdateGender from "./_components/UpdateGender";
import UpdateProfilePhoto from "./_components/UpdateProfilePhoto";
import { TypographyH1 } from "@/customComponents/web/TypographyH1";

const page = () => {
  return (
    <main className="mt-6 flex flex-col gap-y-8 lg:max-w-[500px] md:max-w-[500px] py-6 pb-12 px-4">
      <TypographyH1 text="Modify Profile Details" />
      <UpdateProfilePhoto />
      <UpdateFullname />
      <UpdateGender />
      <UpdateDOB />
      <AddBio />
    </main>
  );
};

export default page;
