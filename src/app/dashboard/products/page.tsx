"use client"

import { useMemo, useState } from "react"
import { useAdminStore, type Product } from "@/components/admin/store"
import { motion } from "framer-motion"
import {
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Scissors,
  Shirt,
  Lightbulb,
  DollarSign,
} from "lucide-react"

// --------------------------
// Reference data (options)
// --------------------------
const categories = ["Tops", "Bottoms", "Outerwear", "Accessories"] as const
const subcategories: Record<(typeof categories)[number], string[]> = {
  Tops: ["T-Shirt", "Shirt", "Hoodie", "Sweater"],
  Bottoms: ["Jeans", "Pants", "Shorts", "Skirt"],
  Outerwear: ["Jacket", "Coat", "Blazer"],
  Accessories: ["Hat", "Scarf", "Belt", "Bag"],
}
const fabrics = ["Cotton", "Polyester", "Wool", "Linen", "Silk", "Denim", "Blend"]
const colors = ["Black", "White", "Gray", "Blue", "Green", "Red", "Yellow", "Purple", "Pink", "Brown"]
const genders = ["Unisex", "Men", "Women", "Kids"]
const fits = ["Slim", "Regular", "Relaxed", "Oversized"]
const seasons = ["All-season", "Spring", "Summer", "Autumn", "Winter"]
const styles = ["Casual", "Formal", "Sport", "Streetwear", "Vintage", "Minimal"]
const statuses = ["draft", "published", "archived"] as const
const priorities = ["low", "medium", "high"] as const
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]

// -----------------------------------------
// UI model that extends the store Product
// -----------------------------------------
type ExtendedProduct = Product & {
  // new structured fields for UI
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

function emptyProduct(): ExtendedProduct {
  const now = new Date().toISOString()
  return {
    id: `p_${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    description: "",
    price: 0,
    // legacy fields kept for compatibility with your store
    categories: [],
    tags: [],
    images: [],
    // new fields
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

export default function ProductsPage() {
  const products = useAdminStore((s) => s.products)
  const addProduct = useAdminStore((s) => s.addProduct)
  const updateProduct = useAdminStore((s) => s.updateProduct)
  const deleteProduct = useAdminStore((s) => s.deleteProduct)

  const [draft, setDraft] = useState<ExtendedProduct>(emptyProduct())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  // ---------- helpers ----------
  const handleInputChange = <K extends keyof ExtendedProduct>(key: K, value: ExtendedProduct[K]) => {
    setDraft((d) => ({
      ...d,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }))
  }

  const toggleArrayItem = (key: "sizes", value: string) => {
    setDraft((d) => {
      const arr = new Set(d[key] ?? [])
      if (arr.has(value)) arr.delete(value)
      else arr.add(value)
      return { ...d, [key]: Array.from(arr), updatedAt: new Date().toISOString() }
    })
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (!tag) return
    setDraft((d) => ({
      ...d,
      tags: Array.from(new Set([...(d.tags || []), tag])),
      updatedAt: new Date().toISOString(),
    }))
    setNewTag("")
  }

  const removeTag = (tag: string) => {
    setDraft((d) => ({
      ...d,
      tags: (d.tags || []).filter((t) => t !== tag),
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setDraft((d) => ({
      ...d,
      images: [url], // NOTE: replace with your upload URL after sending to storage
      updatedAt: new Date().toISOString(),
    }))
  }

  const reset = () => {
    setDraft(emptyProduct())
    setEditingId(null)
    setImagePreview(null)
    setNewTag("")
    setIsSubmitting(false)
  }

  const edit = (p: Product) => {
    const ext = (p as unknown as ExtendedProduct)
    // derive category/subcategory from legacy categories[]
    const cat = Array.isArray(p.categories) && p.categories.length > 0 ? p.categories[0] : ext.category || ""
    const sub = Array.isArray(p.categories) && p.categories.length > 1 ? p.categories[1] : ext.subcategory || ""
    setDraft({
      ...emptyProduct(),
      ...ext,
      category: cat,
      subcategory: sub,
      updatedAt: new Date().toISOString(),
    })
    setEditingId(p.id)
    setImagePreview((ext.images && ext.images[0]) || null)
  }

  const remove = (id: string) => {
    const ok = confirm("Delete this product?")
    if (!ok) return
    deleteProduct(id)
    if (editingId === id) reset()
  }

  const computeCategoriesArray = (d: ExtendedProduct) =>
    [d.category?.trim(), d.subcategory?.trim()].filter(Boolean) as string[]

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      // Basic validation like your disabled button requires
      if (
        !draft.name ||
        !draft.category ||
        !draft.brand ||
        !draft.fabric ||
        !draft.color ||
        !draft.gender
      ) {
        alert("Please fill all required fields.")
        setIsSubmitting(false)
        return
      }

      const payload: ExtendedProduct = {
        ...draft,
        categories: computeCategoriesArray(draft),
        updatedAt: new Date().toISOString(),
      }

      if (isEditing) {
        // cast for store typing; updateProduct usually expects Product
        updateProduct(payload as unknown as Product)
      } else {
        // usually addProduct expects product data without id/timestamps; your store will handle it
        const {
          id, createdAt, updatedAt, ...rest
        } = payload
        addProduct(rest as unknown as Product)
      }

      reset()
    } catch {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div
        className="relative overflow-hidden p-4"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
            linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)
          `,
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="dark:text-white font-mono font-bold">
          {isEditing ? "EDIT PRODUCT" : "PRODUCT MANAGEMENT"}
        </div>
        <div className="text-xs text-blue-500 dark:text-blue-400 font-mono">
          {isEditing ? "UPDATE_EXISTING_PRODUCT" : "ADD_EDIT_DELETE_PRODUCTS"}
        </div>
      </div>

      {/* form */}
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 dark:bg-black/30 backdrop-blur-md border border-emerald-500/30 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono">
              BASIC INFORMATION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm mb-2">
                PRODUCT NAME *
              </label>
              <input
                type="text"
                required
                value={draft.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-emerald-400 focus:outline-none transition-all"
                placeholder="Enter product name..."
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm mb-2">
                BRAND *
              </label>
              <input
                type="text"
                required
                value={draft.brand || ""}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-emerald-400 focus:outline-none transition-all"
                placeholder="Enter brand name..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm mb-2">
                PRICE ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={draft.price}
                  onChange={(e) =>
                    handleInputChange("price", Number.parseFloat(e.target.value) || 0)
                  }
                  className="w-full pl-10 p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-emerald-400 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm mb-2">
                ORIGINAL PRICE ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.originalPrice ?? 0}
                  onChange={(e) =>
                    handleInputChange("originalPrice", Number.parseFloat(e.target.value) || 0)
                  }
                  className="w-full pl-10 p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-emerald-400 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-blue-600 dark:text-blue-400 font-mono text-sm mb-2">
                CATEGORY *
              </label>
              <select
                required
                value={draft.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-blue-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-blue-600 dark:text-blue-400 font-mono text-sm mb-2">
                SUBCATEGORY
              </label>
              <select
                value={draft.subcategory || ""}
                onChange={(e) => handleInputChange("subcategory", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-blue-400 focus:outline-none transition-all appearance-none"
                disabled={!draft.category}
              >
                <option value="">Select subcategory...</option>
                {draft.category &&
                  subcategories[draft.category as keyof typeof subcategories]?.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
              </select>
            </div>

            {/* Fabric */}
            <div>
              <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
                FABRIC *
              </label>
              <select
                required
                value={draft.fabric || ""}
                onChange={(e) => handleInputChange("fabric", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-purple-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select fabric...</option>
                {fabrics.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
                COLOR *
              </label>
              <select
                required
                value={draft.color || ""}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-purple-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select color...</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-teal-600 dark:text-teal-400 font-mono text-sm mb-2">
                GENDER *
              </label>
              <select
                required
                value={draft.gender || ""}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-teal-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select gender...</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Fit */}
            <div>
              <label className="block text-teal-600 dark:text-teal-400 font-mono text-sm mb-2">
                FIT
              </label>
              <select
                value={draft.fit || ""}
                onChange={(e) => handleInputChange("fit", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-teal-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select fit...</option>
                {fits.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block text-orange-600 dark:text-orange-400 font-mono text-sm mb-2">
                SEASON
              </label>
              <select
                value={draft.season || ""}
                onChange={(e) => handleInputChange("season", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-orange-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select season...</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-orange-600 dark:text-orange-400 font-mono text-sm mb-2">
                STYLE
              </label>
              <select
                value={draft.style || ""}
                onChange={(e) => handleInputChange("style", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-orange-400 focus:outline-none transition-all appearance-none"
              >
                <option value="">Select style...</option>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-emerald-600 dark:text-emerald-400 font-mono text-sm mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={draft.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-emerald-400 focus:outline-none transition-all appearance-none resize-none"
              placeholder="Describe your product features, materials, and design details..."
            />
          </div>
        </motion.div>

        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 dark:bg-black/30 backdrop-blur-md border border-blue-500/30 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono">
              PRODUCT IMAGE
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <label className="block text-blue-600 dark:text-blue-400 font-mono text-sm mb-2">
                UPLOAD IMAGE
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>
            {(imagePreview || draft.images?.[0]) && (
              <div className="w-60 h-60 border border-blue-500/30 overflow-hidden">
                <img
                  src={imagePreview || draft.images?.[0] || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/40 dark:bg-black/30 backdrop-blur-md border border-purple-500/30 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono">
              SPECIFICATIONS
            </h2>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
              SIZES
            </label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleArrayItem("sizes", size)}
                  className={`px-3 py-2 font-mono text-sm transition-all ${
                    (draft.sizes || []).includes(size)
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-400"
                      : "bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/30 hover:border-purple-400 hover:text-purple-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Product Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
                STATUS
              </label>
              <select
                value={draft.status || "draft"}
                onChange={(e) => handleInputChange("status", e.target.value as ExtendedProduct["status"])}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-purple-400 focus:outline-none transition-all appearance-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
                PRIORITY
              </label>
              <select
                value={draft.priority || "medium"}
                onChange={(e) => handleInputChange("priority", e.target.value as ExtendedProduct["priority"])}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-purple-400 focus:outline-none transition-all appearance-none"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
                COLLECTION
              </label>
              <input
                type="text"
                value={draft.collection || ""}
                onChange={(e) => handleInputChange("collection", e.target.value)}
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-purple-400 focus:outline-none transition-all"
                placeholder="Enter collection name..."
              />
            </div>
          </div>

          {/* Flags */}
          <div className="mt-6">
            <label className="block text-purple-600 dark:text-purple-400 font-mono text-sm mb-2">
              PRODUCT FLAGS
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!draft.inStock}
                  onChange={(e) => handleInputChange("inStock", e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">IN STOCK</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!draft.isNew}
                  onChange={(e) => handleInputChange("isNew", e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">NEW PRODUCT</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!draft.isSale}
                  onChange={(e) => handleInputChange("isSale", e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">ON SALE</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/40 dark:bg-black/30 backdrop-blur-md border border-teal-500/30 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono">TAGS & KEYWORDS</h2>
          </div>

          <div className="mb-6">
            <label className="block text-teal-600 dark:text-teal-400 font-mono text-sm mb-2">PRODUCT TAGS</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 p-2 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-teal-400 focus:outline-none transition-all"
                placeholder="Enter tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <motion.button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-teal-500/20 border border-teal-500/30 text-teal-600 dark:text-teal-400 hover:border-teal-400 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(draft.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-teal-500/15 text-teal-600 dark:text-teal-400 font-mono text-sm border border-teal-500/30"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-end"
        >
          {isEditing && (
            <motion.button
              type="button"
              onClick={reset}
              className="px-6 py-3 bg-gray-500/20 border border-gray-500/30 text-gray-600 dark:text-gray-400 font-mono hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="h-4 w-4" />
              CANCEL
            </motion.button>
          )}

          <motion.button
            type="submit"
            disabled={
              isSubmitting ||
              !draft.name ||
              !draft.category ||
              !draft.brand ||
              !draft.fabric ||
              !draft.color ||
              !draft.gender
            }
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEditing ? "SAVING..." : "CREATING..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? "SAVE CHANGES" : "CREATE PRODUCT"}
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Table */}
      <div className="relative overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-blue-300 font-mono">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">BRAND</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3">ORIGINAL</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">FABRIC</th>
                <th className="px-4 py-3">COLOR</th>
                <th className="px-4 py-3">GENDER</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">PRIORITY</th>
                <th className="px-4 py-3">SIZES</th>
                <th className="px-4 py-3">FLAGS</th>
                <th className="px-4 py-3">TAGS</th>
                <th className="px-4 py-3">IMAGES</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const ep = p as unknown as ExtendedProduct
                const categoryPath =
                  (ep.category || (p.categories?.[0] ?? "")) +
                  (ep.subcategory || p.categories?.[1] ? ` > ${ep.subcategory || p.categories?.[1]}` : "")
                const flags = [
                  ep.inStock ? "InStock" : null,
                  ep.isNew ? "New" : null,
                  ep.isSale ? "Sale" : null,
                ].filter(Boolean)

                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-white/10"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">{p.id}</td>
                    <td className="px-4 py-3 text-sm dark:text-white font-mono">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 dark:text-gray-200 font-mono">
                      {ep.brand || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.originalPrice ? `$${ep.originalPrice.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {categoryPath || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.fabric || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.color || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.gender || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.status || "draft"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.priority || "medium"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {(ep.sizes || []).join(", ") || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {flags.length ? flags.join(" • ") : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {p.tags?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {p.images?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => edit(p)}
                          className="inline-flex items-center gap-2 px-3 py-2 dark:bg-black/40 border border-blue-500/30 text-blue-300 font-mono text-xs hover:border-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                          EDIT
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          DELETE
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
