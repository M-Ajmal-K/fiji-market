"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "@/components/product-card";
import { useListings } from "@/components/listings-provider";

export function ProductGrid() {
  const { selectedCategory } = useListings();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchListings();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-40 mb-3"></div>
            <div className="space-y-2">
              <div className="bg-muted h-3 rounded w-3/4"></div>
              <div className="bg-muted h-3 rounded w-1/2"></div>
              <div className="bg-muted h-3 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id="browse">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Latest Items</h2>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No listings found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
