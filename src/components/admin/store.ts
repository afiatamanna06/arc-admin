"use client"

import { create } from "zustand"
import { initialUsers, initialProducts, initialDesigns } from "./mock-data"

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

type AdminState = {
  users: AdminUser[]
  products: Product[]
  designs: SubmittedDesign[]
  // actions
  promoteUserById: (id: string) => boolean
  promoteUserByName: (nameQuery: string) => AdminUser | null
  addProduct: (p: Omit<Product, "id" | "createdAt" | "updatedAt">) => Product
  updateProduct: (p: Product) => boolean
  deleteProduct: (id: string) => boolean
  setDesignStatus: (id: string, status: DesignStatus, comment?: string) => boolean
  toggleDesignBranded: (id: string, branded: boolean) => boolean
  setDesignComment: (id: string, comment: string) => boolean
}

export const useAdminStore = create<AdminState>((set, get) => ({
  users: initialUsers,
  products: initialProducts,
  designs: initialDesigns,

  promoteUserById: (id) => {
    const found = get().users.some((u) => u.id === id)
    if (!found) return false
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, role: "designer" } : u)),
    }))
    return true
  },

  promoteUserByName: (nameQuery) => {
    const user = get().users.find((u) => u.name.toLowerCase().includes(nameQuery.toLowerCase()))
    if (!user) return null
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? { ...u, role: "designer" } : u)),
    }))
    return { ...user, role: "designer" }
  },

  addProduct: (p) => {
    const id = `p_${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()
    const newP: Product = { id, createdAt: now, updatedAt: now, ...p }
    set((state) => ({ products: [newP, ...state.products] }))
    return newP
  },

  updateProduct: (p) => {
    const exists = get().products.some((x) => x.id === p.id)
    if (!exists) return false
    set((state) => ({
      products: state.products.map((x) => (x.id === p.id ? { ...p, updatedAt: new Date().toISOString() } : x)),
    }))
    return true
  },

  deleteProduct: (id) => {
    const exists = get().products.some((x) => x.id === id)
    if (!exists) return false
    set((state) => ({ products: state.products.filter((x) => x.id !== id) }))
    return true
  },

  setDesignStatus: (id, status, comment) => {
    const exists = get().designs.some((d) => d.id === id)
    if (!exists) return false
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, status, moderatorComment: comment ?? d.moderatorComment } : d,
      ),
    }))
    return true
  },

  toggleDesignBranded: (id, branded) => {
    const exists = get().designs.some((d) => d.id === id)
    if (!exists) return false
    set((state) => ({
      designs: state.designs.map((d) => (d.id === id ? { ...d, branded } : d)),
    }))
    return true
  },

  setDesignComment: (id, comment) => {
    const exists = get().designs.some((d) => d.id === id)
    if (!exists) return false
    set((state) => ({
      designs: state.designs.map((d) => (d.id === id ? { ...d, moderatorComment: comment } : d)),
    }))
    return true
  },
}))
