import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RejectionWithCollege } from "@/lib/utils";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Search from "./search";
import College from "./college";
import Rejection from "./rejection";

const postSchema = z.object({
  collegeName: z.string().min(1, "Please enter a college name"),
  dateApplied: z.date(),
  dateRejected: z.date(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  highSchool: z.string().optional(),
  gpa: z.number().min(0).max(5),
  sat: z.number().min(400).max(1600).optional(),
  act: z.number().min(1).max(36).optional(),
  classRank: z.number().positive().optional(),
  extracurriculars: z.string().optional(),
  major: z.string().optional(),
});

const stageComponents = [<Search />, <College />, <Rejection />];

export default function Post({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState(0);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Post Rejection</DialogTitle>
          <DialogDescription>Post your rejection to any college.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">{stageComponents[stage]}</div>
      </DialogContent>
    </Dialog>
  );
}
