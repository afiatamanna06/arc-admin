export type Role = "user" | "designer" | "admin"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  joinedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categories: string[]
  tags: string[]
  images: string[]
  createdAt: string
  updatedAt: string
}

export type ExtendedProduct = Product & {
  brand?: string
  originalPrice?: number
  category?: string
  subcategory?: string
  fabric?: string
  color?: string
  gender?: string
  fit?: string
  season?: string
  style?: string
  sizes?: string[]
  status?: "draft" | "published" | "archived"
  priority?: "low" | "medium" | "high"
  collection?: string
  inStock?: boolean
  isNew?: boolean
  isSale?: boolean
}

export type DesignStatus = "pending" | "approved" | "rejected"

export interface SubmittedDesign {
  id: string
  title: string
  imageUrl: string
  author: string
  submittedAt: string
  branded: boolean
  status: DesignStatus
  moderatorComment?: string
}
