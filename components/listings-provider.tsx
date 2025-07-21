"use client";

import { createContext, useContext, useState } from "react";

interface ListingsContextType {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <ListingsContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
