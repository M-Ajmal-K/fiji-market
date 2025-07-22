"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter as FilterIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListings } from "@/components/listings-provider";

const LOCATION_OPTIONS = [
  "all",
  "suva",
  "nadi",
  "lautoka",
  "labasa",
  "ba",
  "sigatoka",
  "nausori",
  "tavua",
  "korovou",
];

const PRICE_RANGES = [
  "all",
  "0-100",
  "100-500",
  "500-1000",
  "1000-5000",
  "5000+",
];

export function SearchBar() {
  const {
    setSearchQuery,
    setLocationFilter,
    setPriceRange,
  } = useListings();

  // local inputs until "Search" clicked
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("all");
  const [pr, setPr] = useState("all");

  const handleSearch = () => {
    setSearchQuery(q);
    setLocationFilter(loc);
    setPriceRange(pr);
  };

  return (
    <div className="bg-card p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-4">
        {/* free-text search */}
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for items..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* location filter */}
        <Select value={loc} onValueChange={setLoc}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATION_OPTIONS.map((locKey) => (
              <SelectItem key={locKey} value={locKey}>
                {locKey === "all"
                  ? "All Locations"
                  : locKey.charAt(0).toUpperCase() + locKey.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* price range filter */}
        <Select value={pr} onValueChange={setPr}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGES.map((range) => (
              <SelectItem key={range} value={range}>
                {range === "all"
                  ? "All Prices"
                  : range === "5000+"
                  ? "$5,000+"
                  : `$${range.split("-")[0]} - $${range.split("-")[1]}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* apply filters */}
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
