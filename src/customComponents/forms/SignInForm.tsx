"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useSignin from "@/hooks/useSignin";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Loader2 } from "lucide-react";

const SigninForm = () => {
  const { form, onSubmit, submitting } = useSignin();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-y-3"
      >
        {/* Email Input. */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">
                Email
              </FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">
                Password
              </FormLabel>
              <FormControl>
                <PasswordInput
                  type="password"
                  placeholder="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitting ? (
          <Button disabled className="mt-6">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
          </Button>
        ) : (
          <Button type="submit" className="mt-6" variant={"default"}>
            Sign In
          </Button>
        )}
      </form>
    </Form>
  );
};

export default SigninForm;
