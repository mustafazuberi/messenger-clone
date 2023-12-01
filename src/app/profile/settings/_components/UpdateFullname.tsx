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
import { Loader2 } from "lucide-react";

const UpdateFullname = () => {
  const { formFullName, onSubmitFullname, updating } = useSettings();
  return (
    <main>
      <Form {...formFullName}>
        <form
          onSubmit={formFullName.handleSubmit(onSubmitFullname)}
          className="flex flex-row gap-y-3 items-start gap-x-4"
        >
          <FormField
            control={formFullName.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Full Name
                </FormLabel>
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

          {updating ? (
            <Button disabled className="mt-[33px] w-[160px] text-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Wait
            </Button>
          ) : (
            <Button type="submit" className="mt-[33px] w-[160px]">
              Update
            </Button>
          )}
        </form>
      </Form>
    </main>
  );
};

export default UpdateFullname;
