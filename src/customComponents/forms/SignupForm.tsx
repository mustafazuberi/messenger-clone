"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSignup from "@/hooks/useSignup";
import EmailSentDialog from "../auth/EmailSentDialog";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SignupForm = () => {
  const [isClient, setIsClient] = useState(false); // this is for solving hydration UI error on dialog
  const { form, onSubmit, loading, openEmailSent, emailSentTo } = useSignup();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-y-3 "
        >
          {/* Full Name Input. */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
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
                  <Input placeholder="m@example.com" {...field} />
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
          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  Gender
                </FormLabel>
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

          <Button type="submit" className="mt-6" variant={"default"}>
            {loading ? "Please Wait..." : "Continue"}
          </Button>
        </form>
      </Form>

      {/* This Dialog Modal Will opens on signup after sending verification email */}
      <Dialog open={openEmailSent}>
        <DialogContent>
          <EmailSentDialog email={emailSentTo} />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default SignupForm;
