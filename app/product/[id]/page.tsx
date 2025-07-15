"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, Share2, MapPin, Calendar, User, MessageCircle, Phone } from "lucide-react"
import type { Product } from "@/types"
import { useAuth } from "@/hooks/use-auth"

// Mock product data - in a real app, this would come from your API
const mockProduct: Product = {
  id: "1",
  title: "iPhone 14 Pro Max - 256GB Space Black",
  description: `Excellent condition iPhone 14 Pro Max in Space Black with 256GB storage. 

Features:
• 6.7-inch Super Retina XDR display
• A16 Bionic chip
• Pro camera system with 48MP Main camera
• Battery health at 95%
• Always-On display
• Dynamic Island

Includes:
• Original box and documentation
• Lightning to USB-C cable
• Unused EarPods
• Screen protector already applied
• Clear case

Phone has been in a case since day one and has no scratches or dents. Selling because I'm upgrading to the latest model. Serious buyers only please.

Available for pickup in Suva or can arrange delivery within the greater Suva area for an additional fee.`,
  price: 1200,
  location: "Suva",
  category: "Electronics",
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  sellerId: "user1",
  sellerName: "John Doe",
  createdAt: new Date("2024-01-15"),
  condition: "Like New",
}

export default function ProductPage() {
  const params = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch product
    const timer = setTimeout(() => {
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

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
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
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

          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative rounded-lg overflow-hidden ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.title} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
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
              <span className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
              <Badge variant="secondary">{product.condition}</Badge>
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

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <div className="prose prose-sm max-w-none">
              {product.description.split("\n").map((paragraph, index) => (
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
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{product.sellerName}</h3>
                    <p className="text-sm text-muted-foreground">Member since 2023</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Actions */}
          {user && user.id !== product.sellerId ? (
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
  )
}
