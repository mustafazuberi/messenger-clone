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
import { RootState } from "@/store";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const AddBio = () => {
  const { formAddBio, onSubmitBio, updating } = useSettings();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  return (
    <main>
      <Form {...formAddBio}>
        <form
          onSubmit={formAddBio.handleSubmit(onSubmitBio)}
          className="flex flex-row gap-y-3 items-start gap-x-4"
        >
          <FormField
            control={formAddBio.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Bio
                </FormLabel>
                <FormControl>
                  <Input placeholder="Bio" {...field} />
                </FormControl>
                <FormDescription className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400">
                  This is your public Bio.
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
              {currentUser.bio ? "Update" : "Add"}
            </Button>
          )}
        </form>
      </Form>
    </main>
  );
};

export default AddBio;
