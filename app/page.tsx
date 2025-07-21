"use client";

import { useState } from "react";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { HeroSection } from "@/components/hero-section";
import { ListingsProvider } from "@/components/listings-provider";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export default function HomePage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <ListingsProvider>
      <div className="min-h-screen bg-background relative">
        <HeroSection />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block md:w-64 space-y-6">
              <CategoryFilter />
            </aside>

            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFiltersOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Main Content */}
            <main className="flex-1">
              <div className="mb-6">
                <SearchBar />
              </div>

              <Suspense
                fallback={
                  <div className="text-center py-8">Loading products...</div>
                }
              >
                <ProductGrid />
              </Suspense>
            </main>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Dark backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setFiltersOpen(false)}
            />

            {/* Slide-in panel */}
            <div className="relative w-64 bg-background h-full p-4 shadow-lg overflow-auto">
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFiltersOpen(false)}
                >
                  <CloseIcon className="h-5 w-5" />
                </Button>
              </div>
              <CategoryFilter />
            </div>
          </div>
        )}
      </div>
    </ListingsProvider>
  );
}
