import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import Search from "./search";
import ViewCollege from "./college";
import AddRejection from "./rejection";

export type PostFormData = {
  college?: { id: string; name: string; acceptanceRate: number | null; gradRate: number | null } | null;
  rejection?: {
    dateApplied: Date;
    dateRejected: Date;
    name: string;
    description: string | null;
    highSchool: string | null;
    gpa: number;
    sat: number | null;
    act: number | null;
    classRank: number | null;
    extracurriculars: string | null;
    major: string | null;
  } | null;
};

export interface PostProps {
  onNext?: (data: Partial<PostFormData>) => void;
  onBack?: () => void;
  formData: PostFormData;
}

export default function Post({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState(0);
  const [formData, setFormData] = useState<PostFormData>({ college: null, rejection: null });

  const handleNext = (data: Partial<PostFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStage((prev) => (prev < 2 ? prev + 1 : prev));
  };

  const handleBack = () => {
    setStage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const stageComponents = [
    <Search onNext={handleNext} formData={formData} />,
    <ViewCollege onNext={handleNext} onBack={handleBack} formData={formData} />,
    <AddRejection onBack={handleBack} formData={formData} />,
  ];

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
