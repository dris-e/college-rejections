"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostProps } from "./post";
import { College } from "@prisma/client";
import { createCollegeSchema } from "@/types/college";
import Link from "next/link";

export default function ViewCollege({ onNext, onBack, formData }: PostProps) {
  const form = useForm<z.infer<typeof createCollegeSchema>>({
    resolver: zodResolver(createCollegeSchema),
    defaultValues: {
      name: formData.college?.name ?? "",
      acceptanceRate: formData.college?.acceptanceRate ?? null,
      gradRate: formData.college?.gradRate ?? null,
    },
  });

  async function onSubmit(values: z.infer<typeof createCollegeSchema>) {
    const res = await fetch("/api/colleges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        acceptanceRate: values.acceptanceRate || null,
        gradRate: values.gradRate || null,
      }),
    });
    const college = (await res.json()) as College;
    onNext?.({ college });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={!!formData.college?.name} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptanceRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acceptance Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormDescription>
                Optional (
                <Link target="_blank" href="https://www.oedb.org/rankings/acceptance-rate/#table-rankings">
                  college stats
                </Link>
                )
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gradRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between mt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="action">
            <CheckIcon className="h-4 w-4" />
            {formData.college?.name ? "Select College" : "Add College"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
