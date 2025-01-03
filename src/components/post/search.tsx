import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

const searchSchema = z.object({
  collegeName: z.string().min(1, "Please enter a college name"),
});

export default function Search() {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      collegeName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    const response = await fetch(`/api/colleges?search=${values.collegeName}`);
    const data = await response.json();
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="collegeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Search for a college</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="action" className="mt-4 w-full">
          <CheckIcon className="w-4 h-4" />
          Search
        </Button>
      </form>
    </Form>
  );
}
