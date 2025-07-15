"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types"

// Mock data - in a real app, this would come from your database
const mockProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 14 Pro Max",
    description: "Excellent condition, barely used. Comes with original box and charger.",
    price: 1200,
    location: "Suva",
    category: "Electronics",
    images: ["/placeholder.svg?height=300&width=300"],
    sellerId: "user1",
    sellerName: "John Doe",
    createdAt: new Date("2024-01-15"),
    condition: "Like New",
  },
  {
    id: "2",
    title: "Toyota Corolla 2018",
    description: "Well maintained vehicle, regular servicing. Perfect for city driving.",
    price: 25000,
    location: "Nadi",
    category: "Vehicles",
    images: ["/placeholder.svg?height=300&width=300"],
    sellerId: "user2",
    sellerName: "Jane Smith",
    createdAt: new Date("2024-01-14"),
    condition: "Good",
  },
  {
    id: "3",
    title: "3BR House for Rent",
    description: "Beautiful 3 bedroom house with garden. Close to schools and shops.",
    price: 800,
    location: "Lautoka",
    category: "Real Estate",
    images: ["/placeholder.svg?height=300&width=300"],
    sellerId: "user3",
    sellerName: "Mike Johnson",
    createdAt: new Date("2024-01-13"),
    condition: "Excellent",
  },
  {
    id: "4",
    title: "Dining Table Set",
    description: "Solid wood dining table with 6 chairs. Perfect for family meals.",
    price: 450,
    location: "Suva",
    category: "Furniture",
    images: ["/placeholder.svg?height=300&width=300"],
    sellerId: "user4",
    sellerName: "Sarah Wilson",
    createdAt: new Date("2024-01-12"),
    condition: "Good",
  },
  {
    id: "5",
    title: "Mountain Bike",
    description: "Trek mountain bike, great for trails. Recently serviced.",
    price: 350,
    location: "Nadi",
    category: "Sports",
    images: ["/placeholder.svg?height=300&width=300"],
    sellerId: "user5",
    sellerName: "David Brown",
    createdAt: new Date("2024-01-11"),
    condition: "Good",
  },
  {
    id: "6",
    title: "Baby Stroller",
    description: "Lightweight stroller, perfect for newborns to toddlers.",
    price: 120,
    location: "Suva",
    category: "Baby & Kids",
    images: ["/placeholder.svg?height=300&width=300"],
    sellerId: "user6",
    sellerName: "Lisa Davis",
    createdAt: new Date("2024-01-10"),
    condition: "Like New",
  },
]

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-4"></div>
            <div className="space-y-2">
              <div className="bg-muted h-4 rounded w-3/4"></div>
              <div className="bg-muted h-4 rounded w-1/2"></div>
              <div className="bg-muted h-4 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div id="browse">
      <h2 className="text-2xl font-bold mb-6">Latest Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
