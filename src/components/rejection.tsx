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

export function Rejection({ rejection }: { rejection: RejectionWithCollege }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col gap-2 justify-start items-start w-full sm:w-64 h-64 cursor-pointer hover:shadow-md transition-all duration-300">
          <div className="w-full h-full overflow-hidden relative p-4 border-rounded-lg">
            <AspectRatio ratio={1}>
              <Image src={rejection.image} alt={rejection.college.name} fill className="object-cover" />
            </AspectRatio>
          </div>
          <CardHeader className="relative w-full p-4 py-2 pb-4">
            <CardTitle>
              {rejection.college.name} ({rejection.college.acceptanceRate}%)
            </CardTitle>
            <CardDescription>
              {rejection.name}, {rejection.gpa.toFixed(1)} GPA, {rejection.sat} SAT
            </CardDescription>
            <CardDescription className="absolute top-0 right-4">{rejection.dateCreated.toLocaleDateString()}</CardDescription>
            <Controls rejection={rejection} type="card" />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{rejection.college.name}</DialogTitle>
          <DialogDescription>
            Applied {rejection.dateApplied.toLocaleDateString()}, Rejected {rejection.dateRejected.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full overflow-hidden relative">
          <AspectRatio ratio={4 / 3}>
            <Image src={rejection.image} alt={rejection.college.name} fill className="object-cover" />
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
                <p className="text-sm text-muted-foreground">Rejections: {rejection.views}</p>
                <Progress value={rejection.views % 100} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {rejection.name} - "{rejection.description}"
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge variant="outline" key={index} className="cursor-pointer" onClick={() => {}}>
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
