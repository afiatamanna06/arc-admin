import { ExtendedProduct } from "../components/admin/types"

export function emptyProduct(): ExtendedProduct {
  const now = new Date().toISOString()
  return {
    id: `p_${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    description: "",
    price: 0,
    categories: [],
    tags: [],
    images: [],
    brand: "",
    originalPrice: 0,
    category: "",
    subcategory: "",
    fabric: "",
    color: "",
    gender: "",
    fit: "",
    season: "",
    style: "",
    sizes: [],
    status: "draft",
    priority: "medium",
    collection: "",
    inStock: true,
    isNew: false,
    isSale: false,
    createdAt: now,
    updatedAt: now,
  }
}

export const computeCategoriesArray = (d: ExtendedProduct) =>
  [d.category?.trim(), d.subcategory?.trim()].filter(Boolean) as string[]
