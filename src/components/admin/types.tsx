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
