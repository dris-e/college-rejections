"use client";

import { useEffect, useState } from "react";
import { Rejection, AddRejectionCard } from "@/components/rejection";
import { RejectionWithCollege } from "@/lib/utils";
import { useParams } from "next/navigation";
import Home from "@/app/page";

export default function RejectionPage() {
  const { id } = useParams();

  const [rejection, setRejection] = useState<RejectionWithCollege | null>(null);

  useEffect(() => {
    async function fetchTotalRejections() {
      try {
        const res = await fetch(`/api/rejection/${id}`);
        const data = (await res.json()) as { rejection: RejectionWithCollege };
        setRejection(data.rejection);

        console.log("rejection", rejection);
      } catch (error) {
        console.error("Failed to fetch total rejections:", error);
      }
    }

    fetchTotalRejections();
  }, [id]);

  return (
    // <div className="flex flex-col gap-8 justify-start items-center w-full">
    //   {rejection ? <Rejection rejection={rejection} standalone /> : <div>No post found</div>}
    // </div>
    <Home>{rejection && <Rejection rejection={rejection} standalone />}</Home>
  );
}
