"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CookieData = {
  views: string[];
  upvotes: string[];
};

type CookieContextType = {
  hasViewed: (id: string) => boolean;
  hasUpvoted: (id: string) => boolean;
  addView: (id: string) => void;
  addUpvote: (id: string) => void;
  removeUpvote: (id: string) => void;
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [cookieData, setCookieData] = useState<CookieData>({ views: [], upvotes: [] });

  useEffect(() => {
    const stored = localStorage.getItem("rejectionData");
    if (stored) {
      setCookieData(JSON.parse(stored));
    }
  }, []);

  const updateStorage = (newData: CookieData) => {
    setCookieData(newData);
    localStorage.setItem("rejectionData", JSON.stringify(newData));
  };

  const hasViewed = (id: string) => cookieData.views.includes(id);
  const hasUpvoted = (id: string) => cookieData.upvotes.includes(id);

  const addView = async (id: string) => {
    if (!hasViewed(id)) {
      const newData = {
        ...cookieData,
        views: [...cookieData.views, id],
      };
      updateStorage(newData);

      await fetch(`/api/rejection/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ views: 1 }),
      });
    }
  };

  const addUpvote = async (id: string) => {
    if (!hasUpvoted(id)) {
      const newData = {
        ...cookieData,
        upvotes: [...cookieData.upvotes, id],
      };
      updateStorage(newData);

      await fetch(`/api/rejection/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ upvotes: 1 }),
      });
    }
  };

  const removeUpvote = async (id: string) => {
    if (hasUpvoted(id)) {
      const newData = {
        ...cookieData,
        upvotes: cookieData.upvotes.filter((upvoteId) => upvoteId !== id),
      };
      updateStorage(newData);

      await fetch(`/api/rejection/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ upvotes: -1 }),
      });
    }
  };

  return (
    <CookieContext.Provider
      value={{
        hasViewed,
        hasUpvoted,
        addView,
        addUpvote,
        removeUpvote,
      }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookie() {
  const context = useContext(CookieContext);
  if (!context) throw new Error("useCookie must be used within CookieProvider");
  return context;
}
