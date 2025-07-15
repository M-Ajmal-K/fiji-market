export interface User {
  id: string
  name: string
  email: string
  location: string
  avatar?: string
  joinedAt: Date
  verified: boolean
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  location: string
  category: string
  images: string[]
  sellerId: string
  sellerName: string
  createdAt: Date
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor"
  status?: "active" | "sold" | "inactive"
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
}
