"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Rejection, AddRejectionCard } from "@/components/rejection";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { RejectionWithCollege } from "@/lib/utils";
import { useRejections } from "@/contexts/rejection";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type RejectionResponse = {
  rejections: Array<RejectionWithCollege>;
  total: number;
  pages: number;
  page: number;
};

export default function Home({ children }: { children?: React.ReactNode }) {
  const { search } = useRejections();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [sort, setSort] = useState(searchParams.get("sort") || "popularity");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const handleSort = (value: string) => {
    setSort(value);
    router.push(`/?sort=${value}&search=${search}`);
  };

  // const { data, isLoading, error } = useQuery<RejectionResponse>({
  //   queryKey: ["rejections", { sort, page, search }],
  //   queryFn: async () => {
  //     const params = new URLSearchParams({ sort, page: String(page), search });
  //     const res = await fetch(`/api/rejection?${params}`);
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     return res.json();
  //   },
  //   staleTime: 1000 * 60,
  //   refetchOnWindowFocus: false,
  // });

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<RejectionResponse>({
    queryKey: ["rejections", { sort, page, search }],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({ sort, page: String(page), search });
      const res = await fetch(`/api/rejection?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    getNextPageParam: (lastPage) => (lastPage.pages > lastPage.page ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div className="flex flex-col gap-8 justify-start items-center w-full">
      <div className="flex flex-row w-full justify-between items-center">
        <Select value={sort} onValueChange={handleSort}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">🔥 Popular</SelectItem>
            <SelectItem value="recent">🕒 Recent Rejections</SelectItem>
            <SelectItem value="oldest">⌛ Oldest Rejections</SelectItem>
            <SelectItem value="views">👀 Most Viewed</SelectItem>
          </SelectContent>
        </Select>
        <h2 className="text-md text-muted-foreground font-bold">
          Sorting by {sort} (showing {data?.pages[0]?.rejections?.length} of {data?.pages[0]?.total})
        </h2>
      </div>

      <div className="flex flex-row justify-center items-start flex-wrap gap-6 w-full">
        <AddRejectionCard />
        {children}
        {data?.pages[0]?.rejections?.map((rejection: RejectionWithCollege) => (
          <Rejection key={rejection.id} rejection={rejection} />
        ))}
      </div>
    </div>
  );
}
