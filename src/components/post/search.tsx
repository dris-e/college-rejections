"use client";

import { CheckIcon, ChevronUpIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { College } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { PostProps } from "./post";
import { useDebounce } from "@/lib/utils";

export default function Search({ onNext }: PostProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const {
    data: colleges = [],
    isLoading,
    error,
  } = useQuery<College[]>({
    queryKey: ["colleges", search],
    queryFn: async () => {
      const res = await fetch(`/api/colleges?search=${search}`);
      if (!res.ok) throw new Error("Failed to fetch colleges");
      return res.json();
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: debouncedSearch.length > 0,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full text-muted-foreground justify-between">
          Search for a college...
          <ChevronUpIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search colleges..." value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty className="flex flex-col items-center gap-4 p-4 mt-2">
              <p>No colleges found</p>
              <Button
                variant="action"
                onClick={() => {
                  setOpen(false);
                  onNext?.({ college: null });
                }}>
                <PlusCircledIcon className="h-4 w-4" />
                Add College
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {colleges?.map((college: College) => (
                <CommandItem
                  key={college.id}
                  value={college.name}
                  className="cursor-pointer"
                  onSelect={() => {
                    setOpen(false);
                    onNext?.({ college });
                  }}>
                  {college.name}
                  <CheckIcon className="h-4 w-4" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
