"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface ListingsContextType {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  locationFilter: string;
  setLocationFilter: (loc: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
}

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined
);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");

  return (
    <ListingsContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        locationFilter,
        setLocationFilter,
        priceRange,
        setPriceRange,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error(
      "useListings must be used within a ListingsProvider"
    );
  }
  return context;
}
