"use client";

import { useListings } from "@/components/listings-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Car,
  Home,
  Sofa,
  Dumbbell,
  Baby,
  Shirt,
  Book,
  Briefcase,
  Music,
} from "lucide-react";

const categories = [
  { id: "electronics", name: "Electronics", icon: Smartphone, count: 45 },
  { id: "vehicles", name: "Vehicles", icon: Car, count: 23 },
  { id: "real-estate", name: "Real Estate", icon: Home, count: 12 },
  { id: "furniture", name: "Furniture", icon: Sofa, count: 34 },
  { id: "sports", name: "Sports & Outdoors", icon: Dumbbell, count: 18 },
  { id: "baby-kids", name: "Baby & Kids", icon: Baby, count: 27 },
  { id: "fashion", name: "Fashion", icon: Shirt, count: 56 },
  { id: "books", name: "Books & Media", icon: Book, count: 15 },
  { id: "business", name: "Business & Industrial", icon: Briefcase, count: 8 },
  { id: "music", name: "Music & Instruments", icon: Music, count: 11 },
];

export function CategoryFilter() {
  const {
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
  } = useListings();

  const selectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    // Clear any previous text searches so category shows all results
    setSearchQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => selectCategory(null)}
        >
          All Categories
        </Button>

        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => selectCategory(cat.id)}
            >
              <div className="flex items-center">
                <Icon className="h-4 w-4 mr-2" />
                {cat.name}
              </div>
              <Badge variant="secondary" className="ml-auto">
                {cat.count}
              </Badge>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
