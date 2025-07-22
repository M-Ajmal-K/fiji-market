"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "@/components/product-card";
import { useListings } from "@/components/listings-provider";

export function ProductGrid() {
  const {
    selectedCategory,
    searchQuery,
    locationFilter,
    priceRange,
  } = useListings();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      // start building the query
      let query = supabase
        .from("listings")
        .select("*")
        .eq("status", "active");

      // category filter
      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      // text search (case-insensitive substring)
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      // location filter (case-insensitive substring)
      if (locationFilter && locationFilter !== "all") {
        query = query.ilike("location", `%${locationFilter}%`);
      }

      // price‐range filter
      if (priceRange && priceRange !== "all") {
        if (priceRange.endsWith("+")) {
          const min = parseFloat(priceRange);
          query = query.gte("price", min);
        } else {
          const [min, max] = priceRange
            .split("-")
            .map((v) => parseFloat(v));
          query = query.gte("price", min).lte("price", max);
        }
      }

      // newest first
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching listings:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }

    setLoading(true);
    fetchListings();
  }, [selectedCategory, searchQuery, locationFilter, priceRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div id="browse">
      <h2 className="text-2xl font-bold mb-6">Latest Items</h2>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No listings found.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
