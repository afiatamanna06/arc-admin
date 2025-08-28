"use client";

import { useState } from "react";
import { useAdminStore, type Product } from "@/components/admin/store";
import { motion } from "framer-motion";

import { ExtendedProduct } from "../admin/types";
import { computeCategoriesArray, emptyProduct } from "@/utils/utils";
import {
  categories,
  subcategories,
  fabrics,
  colors,
  genders,
  fits,
  seasons,
  styles,
  sizeOptions,
  statuses,
  priorities,
} from "@/data/constants";

import {
  Shirt,
  DollarSign,
  Upload,
  Scissors,
  Lightbulb,
  Plus,
  X,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  initial?: ExtendedProduct;
  onSubmitSuccess?: () => void;
};

export default function ProductForm({ initial, onSubmitSuccess }: Props) {
  const { addProduct, updateProduct } = useAdminStore();
  const router = useRouter();
  const [draft, setDraft] = useState<ExtendedProduct>(
    initial ?? emptyProduct()
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initial?.images?.[0] ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const isEditing = Boolean(initial);

  // ---------- helpers ----------
  const handleInputChange = <K extends keyof ExtendedProduct>(
    key: K,
    value: ExtendedProduct[K]
  ) => {
    setDraft((d) => ({
      ...d,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const toggleArrayItem = (key: "sizes", value: string) => {
    setDraft((d) => {
      const arr = new Set(d[key] ?? []);
      if (arr.has(value)) arr.delete(value);
      else arr.add(value);
      return {
        ...d,
        [key]: Array.from(arr),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    setDraft((d) => ({
      ...d,
      tags: Array.from(new Set([...(d.tags || []), tag])),
      updatedAt: new Date().toISOString(),
    }));
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setDraft((d) => ({
      ...d,
      tags: (d.tags || []).filter((t) => t !== tag),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setDraft((d) => ({
      ...d,
      images: [url], // TODO: replace with uploaded storage URL
      updatedAt: new Date().toISOString(),
    }));
  };

  const reset = () => {
    if (isEditing && initial) {
      setDraft(initial);
      setImagePreview(initial.images?.[0] ?? null);
    } else {
      setDraft(emptyProduct());
      setImagePreview(null);
    }
    setNewTag("");
    setIsSubmitting(false);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Basic validation
      if (
        !draft.name ||
        !draft.category ||
        !draft.brand ||
        !draft.fabric ||
        !draft.color ||
        !draft.gender
      ) {
        alert("Please fill all required fields.");
        setIsSubmitting(false);
        return;
      }

      const payload: ExtendedProduct = {
        ...draft,
        categories: computeCategoriesArray(draft),
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        updateProduct(payload as unknown as Product);
      } else {
        const { id, createdAt, updatedAt, ...rest } = payload;
        addProduct(rest as unknown as Product);
      }

      onSubmitSuccess?.();
      reset();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
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
          {isEditing ? "UPDATE_EXISTING_PRODUCT" : "ADD_NEW_PRODUCT"}
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-8 mt-6">
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
                    handleInputChange(
                      "price",
                      Number.parseFloat(e.target.value) || 0
                    )
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
                    handleInputChange(
                      "originalPrice",
                      Number.parseFloat(e.target.value) || 0
                    )
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
                onChange={(e) =>
                  handleInputChange("subcategory", e.target.value)
                }
                className="w-full p-3 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-blue-400 focus:outline-none transition-all appearance-none"
                disabled={!draft.category}
              >
                <option value="">Select subcategory...</option>
                {draft.category &&
                  subcategories[
                    draft.category as keyof typeof subcategories
                  ]?.map((subcat) => (
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
                onChange={(e) =>
                  handleInputChange(
                    "status",
                    e.target.value as ExtendedProduct["status"]
                  )
                }
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
                onChange={(e) =>
                  handleInputChange(
                    "priority",
                    e.target.value as ExtendedProduct["priority"]
                  )
                }
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
                onChange={(e) =>
                  handleInputChange("collection", e.target.value)
                }
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
                  onChange={(e) =>
                    handleInputChange("inStock", e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">
                  IN STOCK
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!draft.isNew}
                  onChange={(e) => handleInputChange("isNew", e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">
                  NEW PRODUCT
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!draft.isSale}
                  onChange={(e) =>
                    handleInputChange("isSale", e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 bg-white/50 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">
                  ON SALE
                </span>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono">
              TAGS & KEYWORDS
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-teal-600 dark:text-teal-400 font-mono text-sm mb-2">
              PRODUCT TAGS
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 p-2 bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 dark:text-white font-mono focus:border-teal-400 focus:outline-none transition-all"
                placeholder="Enter tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
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
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-end"
        >
          {isEditing && (
            <motion.button
              type="button"
              onClick={() => {
                reset();
                router.back();
              }}
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
            className="px-6 py-3 border border-teal-400 bg-teal-500/20 hover:bg-teal-500/15 text-teal-500 dark:text-teal-400 font-mono transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            <Save className="h-4 w-4" />
            {isEditing ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
