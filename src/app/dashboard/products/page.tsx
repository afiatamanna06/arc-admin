"use client"

import { useMemo, useState } from "react"
import { useAdminStore, type Product } from "@/components/admin/store"
import { motion } from "framer-motion"
import { Edit, Plus, Trash2, Save, X, ImageIcon, Tag, FolderTree, DollarSign, FileText } from "lucide-react"

function emptyProduct(): Product {
  return {
    id: `p_${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    description: "",
    price: 0,
    categories: [],
    tags: [],
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export default function ProductsPage() {
  const products = useAdminStore((s) => s.products)
  const addProduct = useAdminStore((s) => s.addProduct)
  const updateProduct = useAdminStore((s) => s.updateProduct)
  const deleteProduct = useAdminStore((s) => s.deleteProduct)

  const [draft, setDraft] = useState<Product>(emptyProduct())
  const [editingId, setEditingId] = useState<string | null>(null)

  const isEditing = useMemo(() => Boolean(editingId), [editingId])

  const reset = () => {
    setDraft(emptyProduct())
    setEditingId(null)
  }

  const save = () => {
    if (!draft.name.trim()) return
    if (isEditing) {
      updateProduct(draft)
    } else {
      addProduct({
        name: draft.name,
        description: draft.description,
        price: draft.price,
        categories: draft.categories,
        tags: draft.tags,
        images: draft.images,
      })
    }
    reset()
  }

  const edit = (p: Product) => {
    setDraft({ ...p })
    setEditingId(p.id)
  }

  const remove = (id: string) => {
    const ok = confirm("Delete this product?")
    if (!ok) return
    deleteProduct(id)
    if (editingId === id) reset()
  }

  return (
    <div className="space-y-6">
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
        <div className="text-white font-mono font-bold">PRODUCT_MANAGEMENT</div>
        <div className="text-xs text-blue-300 font-mono">ADD_EDIT_DELETE_PRODUCTS</div>
      </div>

      <div
        className="relative overflow-hidden p-4 grid md:grid-cols-2 gap-4 border"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        <div className="space-y-3">
          <label className="block text-xs font-mono text-cyan-400">NAME</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Neon Jacket"
              className="w-full pl-10 pr-3 py-3 bg-black/40 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-mono text-cyan-400">PRICE</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
              placeholder="129"
              className="w-full pl-10 pr-3 py-3 bg-black/40 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <label className="block text-xs font-mono text-cyan-400">DESCRIPTION</label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            placeholder="Product description..."
            className="w-full min-h-[90px] p-3 bg-black/40 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-mono text-cyan-400">CATEGORIES (comma separated)</label>
          <div className="relative">
            <FolderTree className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={draft.categories.join(", ")}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  categories: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Apparel, Jackets"
              className="w-full pl-10 pr-3 py-3 bg-black/40 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-mono text-cyan-400">TAGS (comma separated)</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={draft.tags.join(", ")}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  tags: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="neon, reflective"
              className="w-full pl-10 pr-3 py-3 bg-black/40 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <label className="block text-xs font-mono text-cyan-400">IMAGES (URLs, one per line)</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              value={draft.images.join("\n")}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  images: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="/images/a.jpg"
              className="w-full min-h-[90px] pl-10 pr-3 py-3 bg-black/40 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <button
            onClick={save}
            className="inline-flex items-center gap-2 px-4 h-11 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white font-mono font-bold"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isEditing ? "SAVE_CHANGES" : "ADD_PRODUCT"}
          </button>
          {isEditing && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 h-11 bg-black/40 border border-gray-600 text-white font-mono"
            >
              <X className="h-4 w-4" />
              CANCEL
            </button>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-blue-300 font-mono">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">PRICE</th>
                <th className="px-4 py-3">CATEGORIES</th>
                <th className="px-4 py-3">TAGS</th>
                <th className="px-4 py-3">IMAGES</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/10"
                >
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{p.categories.join(", ") || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{p.tags.join(", ") || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{p.images.length}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => edit(p)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-black/40 border border-blue-500/30 text-blue-300 font-mono text-xs hover:border-blue-400"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
