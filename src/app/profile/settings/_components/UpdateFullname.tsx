"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSettings from "@/hooks/useSettings";

const UpdateFullname = () => {
  const { formFullName, onSubmitFullname } = useSettings();
  return (
    <main>
      <Form {...formFullName}>
        <form
          onSubmit={formFullName.handleSubmit(onSubmitFullname)}
          className="flex flex-row gap-y-3 px-4 items-start gap-x-4"
        >
          <FormField
            control={formFullName.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="sm:min-w-[230px] sm:w-[300px] w-[65%]">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Last" {...field} />
                </FormControl>
                <FormDescription className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-[33px]">
            Update
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default UpdateFullname;
