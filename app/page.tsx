import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { HeroSection } from "@/components/hero-section";
import { ListingsProvider } from "@/components/listings-provider"; // ✅ NEW

export default function HomePage() {
  return (
    <ListingsProvider>
      <div className="min-h-screen bg-background">
        <HeroSection />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 space-y-6">
              <CategoryFilter />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="mb-6">
                <SearchBar />
              </div>

              <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
                <ProductGrid />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </ListingsProvider>
  );
}
