"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostProps } from "./post";
import { Rejection } from "@prisma/client";
import { createRejectionSchema } from "@/types/rejection";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRejection({ onBack, formData }: PostProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [optionalVisible, setOptionalVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createRejectionSchema>>({
    resolver: zodResolver(createRejectionSchema),
    defaultValues: {
      name: "",
      image: undefined,
      collegeId: formData.college?.id ?? "",
      dateApplied: undefined,
      dateRejected: undefined,
      description: "",
      highSchool: "",
      gpa: undefined,
      sat: undefined,
      act: undefined,
      classRank: undefined,
      extracurriculars: undefined,
      major: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createRejectionSchema>) {
    try {
      setIsLoading(true);

      const formData = new FormData();

      if (values.image) {
        formData.append("image", values.image);
      }

      const { image, ...rest } = values;
      formData.append("data", JSON.stringify(rest));

      const res = await fetch("/api/rejection", {
        method: "POST",
        body: formData,
      });

      const rejection = (await res.json()) as Rejection;
      router.push(`/${rejection.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rejection</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormDescription>Share your rejection letter/email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={`Explain how you thought you'd get accepted...`}
                  className="min-h-[48px]"
                />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateApplied"
          render={({ field }) => (
            <DatePicker label="Date Applied" value={field.value ? new Date(field.value).toISOString() : undefined} onChange={field.onChange} />
          )}
        />
        <FormField
          control={form.control}
          name="dateRejected"
          render={({ field }) => (
            <DatePicker label="Date Rejected" value={field.value ? new Date(field.value).toISOString() : undefined} onChange={field.onChange} />
          )}
        />
        <FormField
          control={form.control}
          name="gpa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPA</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {optionalVisible && (
          <>
            <FormField
              control={form.control}
              name="highSchool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>High School</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SAT Score</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="act"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ACT Score</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classRank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Rank</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="extracurriculars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extracurriculars</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="List your activities... (comma separated)" />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intended Major</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex flex-col justify-center items-center gap-4 pt-2 mt-4 sticky bottom-0 bg-background">
          <span
            className="text-sm text-center font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setOptionalVisible(!optionalVisible)}>
            {optionalVisible ? "Hide" : "Show"} More Fields...
          </span>
          <div className="flex justify-between w-full">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="action" disabled={isLoading}>
              Post Rejection
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
