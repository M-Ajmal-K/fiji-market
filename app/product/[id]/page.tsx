"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  User,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabaseClient";
import { useHydrated } from "@/hooks/use-hydrated";

export default function ProductPage() {
  // ⚠️ Always call all hooks in the same order:
  const hydrated = useHydrated();
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        console.error("Error fetching product:", error);
        setLoading(false);
        return;
      }
      setProduct(data);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user_id)
        .single();

      setSeller(profile);
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  // Now conditionally render once hydration has completed
  if (!hydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* ...your skeleton markup... */}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-96 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title, price, badges */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price?.toLocaleString()}
              </span>
              <Badge variant="secondary">{product.status}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {product.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <div className="prose prose-sm max-w-none">
              {product.description.split("\n").map((para: string, idx: number) => (
                <p key={idx} className="mb-2">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={seller?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {seller?.full_name || "Unknown Seller"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {seller?.location || "Fiji"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Actions */}
          {user && user.id !== product.user_id ? (
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
              <p className="text-sm text-muted-foreground text-center">
                Sign in to contact the seller
              </p>
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
