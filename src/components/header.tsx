"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Post from "./post/post";
import { useRejections } from "@/contexts/rejection";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const searchSchema = z.object({
  search: z
    .string()
    .min(2, {
      message: "Search must be at least 2 characters.",
    })
    .max(50, {
      message: "Search must be less than 50 characters.",
    })
});

export default function Header() {
  const { search, setSearch } = useRejections();
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: searchParams.get("search") || "",
    },
  });

  useEffect(() => {
    form.setValue("search", search);
  }, [search, form]);

  function onSearch(values: z.infer<typeof searchSchema>) {
    setSearch(values.search);
    router.push(`/?search=${values.search}&sort=${searchParams.get("sort") ?? "popularity"}`);
  }

  return (
    <Link href="/">
      <header className="flex flex-col md:flex-row w-full justify-between items-center md:items-start gap-5 md:gap-4 mt-2 md:mt-0 overflow-hidden p-4">
        <div className="flex justify-center items-center gap-2.5">
          <Image src="assets/cr-icon.svg" alt="CollegeRejections.com logo" width={48} height={48} />
          <h1 className="text-2xl font-bold">CollegeRejections.com</h1>
        </div>
        <div className="flex justify-center items-center gap-3 w-full md:w-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="space-y-8 w-full md:w-auto">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Search for colleges..." className="w-full md:max-w-xs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Post>
            <Button variant="action">
              <span className="text-xl text-center">+</span>
            </Button>
          </Post>
        </div>
      </header>
    </Link>
  );
}
