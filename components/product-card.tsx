"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar } from "lucide-react";
import type { Product } from "@/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <Image
            src={
              product.image_url
                ? product.image_url
                : product.images?.[0] || "/placeholder.svg"
            }
            alt={product.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
            unoptimized
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Badge className="absolute top-2 left-2" variant="secondary">
            {product.condition}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-primary">
              ${product.price?.toLocaleString()}
            </span>
            <Badge variant="outline">{product.category}</Badge>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {product.location}
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {product.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : ""}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {product.sellerName ? `By ${product.sellerName}` : ""}
          </span>
          <Button size="sm" asChild>
            <Link href={`/product/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
