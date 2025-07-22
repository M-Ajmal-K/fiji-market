"use client";

import { useListings } from "@/components/listings-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { id: "electronics", name: "Electronics", icon: Smartphone },
  { id: "vehicles",    name: "Vehicles",    icon: Car        },
  { id: "real-estate", name: "Real Estate", icon: Home      },
  { id: "furniture",   name: "Furniture",   icon: Sofa      },
  { id: "sports",      name: "Sports & Outdoors", icon: Dumbbell },
  { id: "baby-kids",   name: "Baby & Kids", icon: Baby      },
  { id: "fashion",     name: "Fashion",     icon: Shirt     },
  { id: "books",       name: "Books & Media", icon: Book     },
  { id: "business",    name: "Business & Industrial", icon: Briefcase },
  { id: "music",       name: "Music & Instruments", icon: Music    },
];

export function CategoryFilter() {
  const {
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
  } = useListings();

  const selectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setSearchQuery(""); // clear text search when switching categories
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
              className="w-full justify-start"
              onClick={() => selectCategory(cat.id)}
            >
              <div className="flex items-center">
                <Icon className="h-4 w-4 mr-2" />
                {cat.name}
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
