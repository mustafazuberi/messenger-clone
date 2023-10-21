import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FullNameSchema from "@/schema/schema.fullname";
import DOBSchema from "@/schema/shecma.DOB";
import GenderSchema from "@/schema/schema.gender";
import { useToast } from "@/components/ui/use-toast";

const useSettings = () => {
  const { toast } = useToast();

  const formFullName: UseFormReturn<z.infer<typeof FullNameSchema>> = useForm<
    z.infer<typeof FullNameSchema>
  >({
    resolver: zodResolver(FullNameSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const formDOB: UseFormReturn<z.infer<typeof DOBSchema>> = useForm<
    z.infer<typeof DOBSchema>
  >({
    resolver: zodResolver(DOBSchema),
  });

  const formGender = useForm<z.infer<typeof GenderSchema>>({
    resolver: zodResolver(GenderSchema),
    defaultValues: {
      gender: "",
    },
  });

  const onSubmitFullname = () => {};

  function onSubmitDOB(data: z.infer<typeof DOBSchema>) {
    toast({
      title: "You submitted the following values:",
      description: ` <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>`,
    });
  }

  const onSubmitGender = () => {};

  return {
    formFullName,
    formDOB,
    formGender,
    onSubmitFullname,
    onSubmitDOB,
    onSubmitGender,
  };
};

export default useSettings;
