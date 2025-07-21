"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, Share2, MapPin, Calendar, User, MessageCircle, Phone } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";

export default function ProductPage() {
  const params = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      // Load product
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

      // Load seller profile
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-muted rounded-lg h-96"></div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-muted rounded h-20"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-muted h-8 rounded w-3/4"></div>
              <div className="bg-muted h-6 rounded w-1/2"></div>
              <div className="bg-muted h-32 rounded"></div>
            </div>
          </div>
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
              <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
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
              {product.description.split("\n").map((paragraph: string, index: number) => (
                <p key={index} className="mb-2">
                  {paragraph}
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
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{seller?.full_name || "Unknown Seller"}</h3>
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
              <Button variant="outline" className="w-full bg-transparent" size="lg">
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
