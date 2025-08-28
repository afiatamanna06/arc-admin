"use client";

import { useAdminStore } from "@/components/admin/store";
import { motion } from "framer-motion";
import { Edit, Plus, Trash2 } from "lucide-react";
import { ExtendedProduct } from "@/components/admin/types";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { products, deleteProduct } = useAdminStore();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div
        className={`
          flex justify-between items-center p-4
          border border-white/20 dark:border-white/10
          backdrop-blur-[20px]
          bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15)_0%,transparent_60%),linear-gradient(135deg,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.02)_100%)]
          dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25)_0%,transparent_60%),linear-gradient(135deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0.01)_100%)]
        `}
      >
        <div className="relative overflow-hidden">
          <div className="dark:text-white font-mono font-bold">
            {"PRODUCT MANAGEMENT"}
          </div>
          <div className="text-xs text-blue-500 dark:text-blue-400 font-mono">
            {"PRODUCT LIST"}
          </div>
        </div>

        <motion.button
          type="submit"
          onClick={() => router.push("/dashboard/products/add")}
          className="px-6 py-3  bg-blue-500/20 hover:bg-blue-500/15 text-blue-500 font-mono transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Product
        </motion.button>
      </div>
      {/* HEADER */}

      {/* Table */}
      <div
        className="relative overflow-hidden border"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-blue-400 dark:text-blue-300 font-mono">
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
                const ep = p as unknown as ExtendedProduct;
                const categoryPath =
                  (ep.category || (p.categories?.[0] ?? "")) +
                  (ep.subcategory || p.categories?.[1]
                    ? ` > ${ep.subcategory || p.categories?.[1]}`
                    : "");
                const flags = [
                  ep.inStock ? "InStock" : null,
                  ep.isNew ? "New" : null,
                  ep.isSale ? "Sale" : null,
                ].filter(Boolean);

                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-white/10"
                  >
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {p.id}
                    </td>
                    <td className="px-4 py-3 text-sm dark:text-white font-mono">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.brand || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {ep.originalPrice
                        ? `$${ep.originalPrice.toFixed(2)}`
                        : "-"}
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
                          onClick={() =>
                            router.push(`/dashboard/products/${p.id}/edit`)
                          }
                          className="inline-flex items-center gap-2 px-3 py-2 dark:bg-black/40 border cursor-pointer border-blue-500/40 text-blue-400 font-mono text-xs hover:border-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                          EDIT
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/15 border cursor-pointer border-red-500/40 text-red-400 font-mono text-xs hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          DELETE
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
