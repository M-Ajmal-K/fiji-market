"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, Share2, MapPin, Calendar, User, MessageCircle, Phone } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabaseClient";
import { useHydrated } from "@/hooks/use-hydrated";
import type { Product } from "@/types";

export default function ProductPage() {
  const hydrated = useHydrated();
  const params = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // Normalize id from route params
  const productId = useMemo(() => {
    const id = (params as Record<string, unknown>)?.id;
    return Array.isArray(id) ? id[0] : (id as string | undefined);
  }, [params]);

  const sellerInitial = useMemo(() => {
    if (!product?.sellerName) return undefined;
    return product.sellerName.trim().charAt(0).toUpperCase();
  }, [product?.sellerName]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      if (!productId) return;

      // Debug: confirm which project + id your client is using
      console.log("[Debug] productId:", productId, "supabaseUrl:", process.env.NEXT_PUBLIC_SUPABASE_URL);

      try {
        // Use select("*") to avoid column mismatch; we’ll map safely below
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", productId)
          .eq("status", "active") // aligns with public read policy
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.error("[Supabase] select listings error:", error);
          setProduct(null);
          setLoading(false);
          return;
        }

        if (!data) {
          console.warn("[Supabase] no product found for id (after filters):", productId);
          setProduct(null);
          setLoading(false);
          return;
        }

        // Map DB → TS Product (guard optional fields)
        const mapped: Product = {
          id: data.id,
          title: data.title,
          description: data.description ?? "",
          price: data.price,
          location: data.location ?? "",
          category: data.category ?? "",
          condition: data.condition ?? "Good",
          status: (data.status ?? "active") as Product["status"],
          createdAt: new Date(data.created_at),
          image_url: data.image_url ?? undefined,
          images: Array.isArray(data.images) ? data.images : [],
          sellerId: data.user_id,
          sellerName: data.seller_name ?? "Unknown Seller",
        };

        setProduct(mapped);
        setLoading(false);
      } catch (err) {
        console.error("[Supabase] unexpected error:", err);
        setProduct(null);
        setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (!hydrated) return null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="w-full aspect-[4/3] rounded-lg bg-muted" />
          <div className="h-6 w-2/3 rounded bg-muted" />
          <div className="h-5 w-1/3 rounded bg-muted" />
          <div className="h-32 w-full rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          If this should be visible publicly, ensure its status is <code>active</code> and your local
          environment points to the correct Supabase project.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={product.image_url ?? product.images?.[0] ?? "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <Button variant="ghost" size="icon" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toLocaleString()}
              </span>
              {product.status && <Badge variant="secondary">{product.status}</Badge>}
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {product.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {product.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <div className="prose prose-sm max-w-none">
              {(product.description ?? "").split("\n").map((para, idx) => (
                <p key={idx} className="mb-2">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <Separator />

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="uppercase">
                      {sellerInitial ?? <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{product.sellerName || "Unknown Seller"}</h3>
                    <p className="text-sm text-muted-foreground">{product.location || "Fiji"}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>

          {user && user.id !== product.sellerId ? (
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Show Phone Number
              </Button>
            </div>
          ) : !user ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Sign in to contact the seller</p>
              <Button className="w-full" size="lg" asChild>
                <a href="/auth/signin">Sign In</a>
              </Button>
            </div>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">This is your listing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
