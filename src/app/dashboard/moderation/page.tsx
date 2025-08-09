"use client"

import { useState } from "react"
import { useAdminStore } from "@/components/admin/store"
import { motion } from "framer-motion"
import { Eye, Check, X, BadgeCheck } from "lucide-react"

export default function ModerationPage() {
  const designs = useAdminStore((s) => s.designs)
  const setDesignStatus = useAdminStore((s) => s.setDesignStatus)
  const toggleDesignBranded = useAdminStore((s) => s.toggleDesignBranded)
  const setDesignComment = useAdminStore((s) => s.setDesignComment)
  const [viewer, setViewer] = useState<{ open: boolean; src?: string; title?: string }>({ open: false })

  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden p-4"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.15) 0%, transparent 60%),
            linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)
          `,
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="text-white font-mono font-bold">DESIGN_MODERATION</div>
        <div className="text-xs text-teal-300 font-mono">APPROVE_REJECT_BRAND</div>
      </div>

      <div className="relative overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-teal-300 font-mono">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">TITLE</th>
                <th className="px-4 py-3">AUTHOR</th>
                <th className="px-4 py-3">SUBMITTED_AT</th>
                <th className="px-4 py-3">BRANDED</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">COMMENT</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/10 align-top"
                >
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{d.id}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">
                    <button
                      className="underline text-teal-300 hover:text-teal-200"
                      onClick={() => setViewer({ open: true, src: d.imageUrl, title: d.title })}
                    >
                      {d.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{d.author}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                    {new Date(d.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d.branded}
                        onChange={(e) => toggleDesignBranded(d.id, e.target.checked)}
                        className="w-4 h-4 bg-black/50 border border-gray-600 text-teal-500"
                      />
                      <span className="text-xs">MARK_BRANDED</span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">
                    <span
                      className={`px-2 py-1 text-xs ${
                        d.status === "approved"
                          ? "text-green-300"
                          : d.status === "rejected"
                            ? "text-red-300"
                            : "text-yellow-300"
                      }`}
                    >
                      {d.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <input
                      value={d.moderatorComment ?? ""}
                      onChange={(e) => setDesignComment(d.id, e.target.value)}
                      placeholder="Comment..."
                      className="w-full bg-black/40 border border-gray-600 text-white px-3 py-2 font-mono placeholder-gray-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setViewer({ open: true, src: d.imageUrl, title: d.title })}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-black/40 border border-teal-500/30 text-teal-300 font-mono text-xs hover:border-teal-400"
                      >
                        <Eye className="h-4 w-4" />
                        VIEW
                      </button>
                      <button
                        onClick={() => setDesignStatus(d.id, "approved", d.moderatorComment)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-300 font-mono text-xs hover:border-green-400"
                      >
                        <Check className="h-4 w-4" />
                        APPROVE
                      </button>
                      <button
                        onClick={() => setDesignStatus(d.id, "rejected", d.moderatorComment)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs hover:border-red-400"
                      >
                        <X className="h-4 w-4" />
                        REJECT
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewer.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setViewer({ open: false })}
        >
          <div
            className="relative w-full max-w-4xl bg-black/60 border border-white/20 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-white font-mono">
                <BadgeCheck className="h-5 w-5 text-teal-300" />
                {viewer.title}
              </div>
              <button
                onClick={() => setViewer({ open: false })}
                className="px-3 py-2 bg-black/40 border border-gray-600 text-white font-mono text-xs"
              >
                CLOSE
              </button>
            </div>
            <div className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewer.src || "/placeholder.svg?height=720&width=1080&query=design-preview"}
                alt={viewer.title || "design"}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
