"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useSettings from "@/hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UpdateGender = () => {
  const { formGender, onSubmitGender, updating } = useSettings();
  return (
    <main>
      <Form {...formGender}>
        <form
          onSubmit={formGender.handleSubmit(onSubmitGender)}
          className="flex flex-row gap-y-3 items-start gap-x-4"
        >
          <FormField
            control={formGender.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-[33px] w-[160px]"
            disabled={updating}
          >
            {updating ? "Please wait..." : "Update"}
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default UpdateGender;
