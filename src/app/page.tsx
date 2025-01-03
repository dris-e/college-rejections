"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Rejection, AddRejectionCard } from "@/components/rejection";

import { RejectionTest } from "@/lib/utils";

export default function Home() {
  const [sortBy, setSortBy] = useState("popularity");

  return (
    <div className="flex flex-col gap-8 justify-start items-center w-full">
      <div className="flex flex-row w-full justify-between items-center">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">🔥 Popular</SelectItem>
            <SelectItem value="recent">🕒 Recent Rejections</SelectItem>
            <SelectItem value="oldest">⌛ Oldest Rejections</SelectItem>
          </SelectContent>
        </Select>
        <h2 className="text-md text-muted-foreground font-bold">Sorting by most popular (11 found)</h2>
      </div>

      <div className="flex flex-row justify-center items-start flex-wrap gap-6 w-full">
        <AddRejectionCard />
        {Array.from({ length: 12 }).map((_, index) => (
          <Rejection key={index} rejection={RejectionTest} />
        ))}
      </div>
    </div>
  );
}
