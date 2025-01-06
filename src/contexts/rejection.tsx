"use client";

import { createContext, useContext, useState } from "react";

type RejectionsContextType = {
  search: string;
  setSearch: (search: string) => void;
};

const RejectionsContext = createContext<RejectionsContextType | undefined>(undefined);

export function RejectionsProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");

  return <RejectionsContext.Provider value={{ search, setSearch }}>{children}</RejectionsContext.Provider>;
}

export function useRejections() {
  const context = useContext(RejectionsContext);
  if (!context) throw new Error("useRejections must be used within RejectionsProvider");
  return context;
}
