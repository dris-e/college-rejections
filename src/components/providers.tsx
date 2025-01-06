"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { RejectionsProvider } from "@/contexts/rejection";
import { CookieProvider } from "@/contexts/cookie";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RejectionsProvider>
        <CookieProvider>{children}</CookieProvider>
      </RejectionsProvider>
    </QueryClientProvider>
  );
}