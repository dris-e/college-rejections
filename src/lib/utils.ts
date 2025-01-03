import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Rejection as RejectionType, College as CollegeType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RejectionWithCollege = RejectionType & {
  college: CollegeType;
};

export const CollegeTest: CollegeType = {
  id: "1",
  name: "Harvard",
  acceptanceRate: 1,
  gradRate: 1,
};

export const RejectionTest: RejectionWithCollege = {
  id: "1",
  collegeId: "1",
  dateRejected: new Date(),
  dateApplied: new Date(),
  name: "Dris Elamri",
  description: "they shouldve let me in",
  highSchool: "MHS",
  image: "/assets/harvard.jpg",
  views: 1,
  upvotes: 1,
  gpa: 4.0,
  sat: 1500,
  act: 30,
  classRank: 4,
  extracurriculars: "1",
  major: "Business",
  dateCreated: new Date(),
  college: CollegeTest,
};

// export async function getRejectionWithCollege(rejectionId: string) {
//   const rejection = await prisma.rejection.findUnique({
//     where: { id: rejectionId },
//     include: { college: true }
//   });
//   return rejection;
// }

// export async function getAllRejectionsWithColleges() {
//   const rejections = await prisma.rejection.findMany({
//     include: { college: true }
//   });
//   return rejections;
// }
