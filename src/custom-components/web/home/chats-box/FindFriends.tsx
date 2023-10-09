"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import User from "@/types/types.user";

const FindFriends = ({ users }: { users: User[] }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<User | null>(null);
  return (
    <main className="flex flex-row justify-between p-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? users.find((user) => user.displayName === value.displayName)
                  ?.displayName
              : "Find Friends..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-full">
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  className="py-1 mt-1 cursor-pointer"
                  key={user.uid}
                  onSelect={(currentValue) => {
                    setValue(
                      currentValue === value?.displayName ? value : null
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value?.displayName === user.displayName
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-row min-w-full justify-between items-end">
                    <div className="flex flex-col">
                      <div>{user.displayName}</div>
                      <div>
                        {user.email.length > 18
                          ? user.email.slice(0, 18) + "..."
                          : user.email.slice(0, 18)}
                      </div>
                    </div>
                    <button className="px-2 rounded-lg bg-purple-500 text-white text-[10px] h-5 flex">
                      Add
                    </button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </main>
  );
};

export default FindFriends;
