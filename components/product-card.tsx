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
    <Card className="group hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={
              product.image_url ?? product.images?.[0] ?? "/placeholder.svg"
            }
            alt={product.title}
            fill
            className="object-cover"
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

        <CardContent className="p-3 space-y-2 flex-grow">
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg sm:text-2xl font-bold text-primary">
              ${product.price?.toLocaleString()}
            </span>
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {product.location}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {product.createdAt
              ? new Date(product.createdAt).toLocaleDateString()
              : ""}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-3 pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs sm:text-sm text-muted-foreground">
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
