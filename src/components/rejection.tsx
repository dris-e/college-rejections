"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TriangleUpIcon, EyeOpenIcon, Share2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RejectionWithCollege } from "@/lib/utils";
import { Controls } from "./controls";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import Post from "./post/post";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRejections } from "@/contexts/rejection";
import { useRouter } from "next/navigation";
import { useCookie } from "@/contexts/cookie";
import Link from "next/link";
const tags = [
  {
    name: "High School",
    value: "highSchool",
  },
  {
    name: "GPA",
    value: "gpa",
  },
  {
    name: "SAT",
    value: "sat",
  },
  {
    name: "ACT",
    value: "act",
  },
  {
    name: "Class Rank",
    value: "classRank",
  },
  {
    name: "Extracurriculars",
    value: "extracurriculars",
  },
  {
    name: "Major",
    value: "major",
  },
];

export function Rejection({ rejection, standalone = false }: { rejection: RejectionWithCollege; standalone?: boolean }) {
  const { setSearch } = useRejections();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { hasViewed, addView } = useCookie();
  const [viewProcessed, setViewProcessed] = useState(false);

  const [totalRejections, setTotalRejections] = useState(0);
  const [open, setOpen] = useState(standalone);

  useEffect(() => {
    async function fetchTotalRejections() {
      try {
        const res = await fetch(`/api/rejection?collegeId=${rejection.collegeId}`);
        const data = (await res.json()) as { total: number };
        console.log(data);
        setTotalRejections(data.total);
      } catch (error) {
        console.error("Failed to fetch total rejections:", error);
      }
    }

    fetchTotalRejections();
  }, [rejection.collegeId]);

  const handleTagClick = (tag: string) => {
    setSearch(tag);
    setOpen(false);
    router.push(`/?search=${tag}&sort=${searchParams.get("sort") ?? "popularity"}`);
  };

  useEffect(() => {
    if (!hasViewed(rejection.id) && !viewProcessed) {
      setViewProcessed(true);
      addView(rejection.id);
    }
  }, [rejection.id, hasViewed, addView, viewProcessed]);

  console.log(rejection);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="flex flex-col gap-2 justify-start items-start w-full sm:w-64 h-64 cursor-pointer hover:shadow-md transition-all duration-300">
          <div className="w-full h-full overflow-hidden relative p-4 border-rounded-lg">
            <AspectRatio ratio={1}>
              <Image
                src={`https://${rejection.image}`}
                alt={`${rejection.name}'s rejection for ${rejection.college.name}`}
                fill
                className="object-cover"
              />
            </AspectRatio>
          </div>
          <CardHeader className="relative w-full p-4 py-2 pb-4">
            <CardTitle>
              {rejection.college.name} ({rejection.college.acceptanceRate}%)
            </CardTitle>
            <CardDescription>
              {rejection.name}, {rejection.gpa.toFixed(1)} GPA, {rejection.sat} SAT
            </CardDescription>
            {/* <CardDescription className="absolute top-0 right-4">{new Date(rejection.dateCreated).toLocaleDateString()}</CardDescription> */}
            <Controls rejection={rejection} type="card" />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="cursor-pointer" onClick={() => handleTagClick(rejection.college.name)}>
            {rejection.college.name}
          </DialogTitle>
          <DialogDescription>
            Applied {new Date(rejection.dateApplied).toLocaleDateString()}, Rejected {new Date(rejection.dateRejected).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full group flex justify-center items-center overflow-hidden relative">
          <Badge variant="action" className="z-10 group-hover:opacity-100 opacity-0 absolute transition-all duration-300">
            <Link href={`https://${rejection.image}`} target="_blank">
              View Rejection
            </Link>
          </Badge>
          <AspectRatio ratio={4 / 3} onClick={() => window.open(`https://${rejection.image}`, "_blank")}>
            <Image
              src={`https://${rejection.image}`}
              alt={`${rejection.name}'s rejection for ${rejection.college.name}`}
              fill
              className="object-cover cursor-pointer"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">College Stats</h3>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Acceptance Rate: {rejection.college.acceptanceRate}%</p>
                <Progress value={rejection.college.acceptanceRate} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Graduation Rate: {rejection.college.gradRate}%</p>
                <Progress value={rejection.college.gradRate} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Rejections: {totalRejections}</p>
                <Progress value={totalRejections % 100} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {rejection.name} - "{rejection.description}"
            </p>
            <div className="flex flex-wrap gap-2">
              {tags
                .filter(
                  (tag) => rejection[tag.value as keyof RejectionWithCollege] != null && rejection[tag.value as keyof RejectionWithCollege] !== ""
                )
                .map((tag, index) => (
                  <Badge
                    variant="outline"
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleTagClick(rejection[tag.value as keyof RejectionWithCollege]?.toString() ?? "")}>
                    {tag.name}:{" "}
                    {rejection[tag.value as keyof RejectionWithCollege] instanceof Date
                      ? (rejection[tag.value as keyof RejectionWithCollege] as Date).toLocaleDateString()
                      : tag.value === "gpa"
                      ? (rejection[tag.value] as number).toFixed(1)
                      : String(rejection[tag.value as keyof RejectionWithCollege])}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Controls rejection={rejection} type="dialog" />
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddRejectionCard() {
  return (
    <Post>
      <Card className="flex flex-col gap-2 border-dashed border-2 justify-start items-start w-full sm:w-64 h-64 cursor-pointer hover:shadow-md transition-all duration-300">
        <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
          <span className="text-5xl text-center">+</span>
          <p className="text-sm text-center text-muted-foreground max-w-40">Post your rejection to any college</p>
        </div>
      </Card>
    </Post>
  );
}
