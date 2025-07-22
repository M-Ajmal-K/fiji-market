"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ProductCard } from "@/components/product-card";
import { useListings } from "@/components/listings-provider";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

export function ProductGrid() {
  const {
    selectedCategory,
    searchQuery,
    locationFilter,
    priceRange,
  } = useListings();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = async (pageIndex: number) => {
    setLoading(true);

    let query = supabase
      .from("listings")
      .select("*")
      .eq("status", "active");

    if (selectedCategory) {
      query = query.eq("category", selectedCategory);
    }
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }
    if (locationFilter && locationFilter !== "all") {
      query = query.ilike("location", `%${locationFilter}%`);
    }
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

    // deterministic tie-breaker: order by created_at desc, then id desc
    query = query
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    // offset pagination
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error } = await query;
    setLoading(false);

    if (error) {
      console.error("Error fetching listings:", error);
      return;
    }

    if (data) {
      setProducts((prev) => {
        // filter out duplicates by id
        const newItems = data.filter(
          (item) => !prev.some((p) => p.id === item.id)
        );
        return [...prev, ...newItems];
      });
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
  };

  // Reset & fetch first page on filter changes
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    fetchPage(0);
  }, [selectedCategory, searchQuery, locationFilter, priceRange]);

  // Handler for "Load More"
  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  };

  return (
    <div id="browse">
      <h2 className="text-2xl font-bold mb-6">Latest Items</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* States */}
      {!loading && products.length === 0 && (
        <p className="text-muted-foreground mt-8">No listings found.</p>
      )}
      {loading && <p className="text-center py-8">Loading…</p>}

      {/* Load More */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
}
