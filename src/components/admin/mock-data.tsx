import type { AdminUser, Product, SubmittedDesign } from "./types"

export const initialUsers: AdminUser[] = [
  { id: "u_001", name: "Alice Johnson", email: "alice@example.com", role: "user", joinedAt: "2025-06-01" },
  { id: "u_002", name: "Bob Designer", email: "bob@example.com", role: "designer", joinedAt: "2025-05-21" },
  { id: "u_003", name: "Chris Lee", email: "chris@example.com", role: "user", joinedAt: "2025-05-10" },
  { id: "u_004", name: "Diana Cruz", email: "diana@example.com", role: "user", joinedAt: "2025-04-29" },
]

export const initialProducts: Product[] = [
  {
    id: "p_001",
    name: "Neon Hoodie",
    description: "Cyberpunk neon-lined hoodie with reflective seams.",
    price: 129,
    categories: ["Apparel", "Hoodies"],
    tags: ["neon", "streetwear"],
    images: ["/neon-hoodie.png"],
    createdAt: "2025-05-01",
    updatedAt: "2025-06-11",
  },
  {
    id: "p_002",
    name: "Glass Tee",
    description: "Ultra-soft tee with glassmorphism print.",
    price: 49,
    categories: ["Apparel", "Tees"],
    tags: ["glassmorphism", "minimal"],
    images: ["/glass-tee.png"],
    createdAt: "2025-05-12",
    updatedAt: "2025-06-05",
  },
]

export const initialDesigns: SubmittedDesign[] = [
  {
    id: "d_001",
    title: "Prismatic Grid",
    imageUrl: "/prismatic-grid.png",
    author: "Alice Johnson",
    submittedAt: "2025-06-15T14:21:00Z",
    branded: false,
    status: "pending",
  },
  {
    id: "d_002",
    title: "Neon Flux",
    imageUrl: "/neon-flux-poster.png",
    author: "Chris Lee",
    submittedAt: "2025-06-16T09:05:00Z",
    branded: true,
    status: "pending",
  },
]
