"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, Send, Wand2, X, Navigation, Check, Trash2, UserPlus, ImageIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAdminStore } from "./store"

type ChatMsg = { id: string; role: "user" | "assistant"; content: string }

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function AdminAIChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<ChatMsg[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "NEXUS Admin Assistant online. Try: 'promote u_001', 'add product name: Neon Jacket price: 149 categories: Apparel,Jackets tags: neon,reflective', 'approve d_001 comment: looks great', 'navigate products', 'list designs', or 'help'.",
    },
  ])
  const [aiMode, setAiMode] = useState(false) // Optional server LLM; falls back to local parser
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const store = useAdminStore()
  const state = useAdminStore((s) => s) // snapshot for summaries

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [history, open])

  const sendAssistantReply = (text: string) => {
    setHistory((h) => [...h, { id: uid(), role: "assistant", content: text }])
  }

  // Helpers
  const findUser = (token: string) => {
    if (token.startsWith("u_")) return store.users.find((u) => u.id === token)
    return store.users.find((u) => u.name.toLowerCase().includes(token.toLowerCase()))
  }
  const findProduct = (idOrName: string) => {
    if (idOrName.startsWith("p_")) return store.products.find((p) => p.id === idOrName)
    return store.products.find((p) => p.name.toLowerCase().includes(idOrName.toLowerCase()))
  }
  const findDesign = (idOrTitle: string) => {
    if (idOrTitle.startsWith("d_")) return store.designs.find((d) => d.id === idOrTitle)
    return store.designs.find((d) => d.title.toLowerCase().includes(idOrTitle.toLowerCase()))
  }

  const parseKV = (text: string) => {
    // Parses "name: X price: 123 categories: a,b tags: x,y images: url1; url2 description: lorem"
    const pick = (key: string) => {
      const re = new RegExp(`${key}\\s*:\\s*([\\s\\S]*?)(?=\\s+\\w+\\s*:|$)`, "i")
      const m = text.match(re)
      return m ? m[1].trim() : ""
    }
    const kv = {
      name: pick("name"),
      price: pick("price"),
      categories: pick("categories"),
      tags: pick("tags"),
      images: pick("images"),
      description: pick("description"),
    }
    return kv
  }

  const summary = useMemo(() => {
    return `Users: ${state.users.length} • Designers: ${state.users.filter((u) => u.role === "designer").length} • Products: ${state.products.length} • Designs: ${state.designs.length} (pending: ${state.designs.filter((d) => d.status === "pending").length})`
  }, [state.users, state.products, state.designs])

  const localExecute = (raw: string): string => {
    const text = raw.trim()

    // HELP
    if (/^(help|\?)$/i.test(text)) {
      return [
        "Commands:",
        "- promote <u_id|name>",
        "- navigate <dashboard|users|products|moderation>",
        "- add product name: ... price: ... categories: a,b tags: x,y images: url1; url2 description: ...",
        "- edit product <p_id|name> name: ... price: ... ...",
        "- delete product <p_id|name>",
        "- approve <d_id|title> [comment: ...]",
        "- reject <d_id|title> [comment: ...]",
        "- brand <d_id|title> <on|off>",
        "- list <users|products|designs>",
        "- summary",
      ].join("\n")
    }

    // NAVIGATE
    const nav = text.match(/\b(?:go|open|navigate)\s+(dashboard|users|products|moderation)\b/i)
    if (nav) {
      const dest = nav[1].toLowerCase()
      router.push(dest === "dashboard" ? "/dashboard" : `/dashboard/${dest}`)
      return `Navigating to ${dest.toUpperCase()}...`
    }

    // SUMMARY
    if (/\bsummary|status|stats\b/i.test(text)) {
      return `System Summary → ${summary}`
    }

    // LIST
    const ls = text.match(/\b(?:list|show)\s+(users|products|designs)\b/i)
    if (ls) {
      const what = ls[1]
      if (what === "users") {
        return store.users.map((u) => `${u.id} • ${u.name} • ${u.email} • ${u.role}`).join("\n") || "No users."
      }
      if (what === "products") {
        return store.products.map((p) => `${p.id} • ${p.name} • $${p.price}`).join("\n") || "No products."
      }
      if (what === "designs") {
        return (
          store.designs.map((d) => `${d.id} • ${d.title} • ${d.status}${d.branded ? " • branded" : ""}`).join("\n") ||
          "No designs."
        )
      }
    }

    // PROMOTE USER
    const promoteId = text.match(/\bpromote\s+(u_[a-z0-9]+)\b/i)
    if (promoteId) {
      const ok = store.promoteUserById(promoteId[1])
      return ok ? `Promoted ${promoteId[1]} to DESIGNER.` : `User ${promoteId[1]} not found.`
    }
    const promoteByName = text.match(/\bpromote\s+(.+?)\s*(?:to\s+designer)?$/i)
    if (promoteByName && !promoteId) {
      const res = store.promoteUserByName(promoteByName[1])
      return res ? `Promoted ${res.name} (${res.id}) to DESIGNER.` : `User "${promoteByName[1]}" not found.`
    }

    // ADD PRODUCT
    if (/\badd\s+product\b/i.test(text)) {
      const kv = parseKV(text)
      const price = Number(kv.price || "0")
      const categories = kv.categories
        ? kv.categories
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      const tags = kv.tags
        ? kv.tags
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      const images = kv.images
        ? kv.images
            .split(/[;\n,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      if (!kv.name) return "Missing name:. Use 'add product name: ...'"
      const p = store.addProduct({
        name: kv.name,
        description: kv.description || "",
        price,
        categories,
        tags,
        images,
      })
      return `Product created: ${p.id} • ${p.name} • $${p.price}`
    }

    // EDIT PRODUCT
    const editMatch = text.match(/\b(?:edit|update)\s+product\s+([^\s]+)\s*(.*)$/i)
    if (editMatch) {
      const idOrName = editMatch[1]
      const target = findProduct(idOrName)
      if (!target) return `Product "${idOrName}" not found.`
      const rest = editMatch[2]
      const kv = parseKV(rest)
      const price = kv.price ? Number(kv.price) : target.price
      const categories = kv.categories?.length
        ? kv.categories
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : target.categories
      const tags = kv.tags?.length
        ? kv.tags
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : target.tags
      const images = kv.images?.length
        ? kv.images
            .split(/[;\n,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : target.images
      const updated = {
        ...target,
        name: kv.name || target.name,
        description: kv.description || target.description,
        price,
        categories,
        tags,
        images,
      }
      const ok = store.updateProduct(updated)
      return ok ? `Updated ${updated.id} • ${updated.name}` : "Update failed."
    }

    // DELETE PRODUCT
    const delMatch = text.match(/\b(?:delete|remove)\s+product\s+([^\s]+)\b/i)
    if (delMatch) {
      const idOrName = delMatch[1]
      const target = findProduct(idOrName)
      if (!target) return `Product "${idOrName}" not found.`
      const ok = store.deleteProduct(target.id)
      return ok ? `Deleted product ${target.id} • ${target.name}` : "Delete failed."
    }

    // APPROVE / REJECT DESIGN
    const approve = text.match(/\bapprove\s+([^\s]+)(?:\s+comment\s*:\s*([\s\S]+))?/i)
    if (approve) {
      const idOrTitle = approve[1]
      const comment = approve[2]
      const target = findDesign(idOrTitle)
      if (!target) return `Design "${idOrTitle}" not found.`
      const ok = store.setDesignStatus(target.id, "approved", comment)
      return ok ? `Approved ${target.id} • ${target.title}${comment ? ` — ${comment}` : ""}` : "Approve failed."
    }
    const reject = text.match(/\breject\s+([^\s]+)(?:\s+comment\s*:\s*([\s\S]+))?/i)
    if (reject) {
      const idOrTitle = reject[1]
      const comment = reject[2]
      const target = findDesign(idOrTitle)
      if (!target) return `Design "${idOrTitle}" not found.`
      const ok = store.setDesignStatus(target.id, "rejected", comment)
      return ok ? `Rejected ${target.id} • ${target.title}${comment ? ` — ${comment}` : ""}` : "Reject failed."
    }

    // BRAND ON/OFF
    const brand = text.match(/\bbrand\s+([^\s]+)\s+(on|off)\b/i)
    if (brand) {
      const idOrTitle = brand[1]
      const on = brand[2].toLowerCase() === "on"
      const target = findDesign(idOrTitle)
      if (!target) return `Design "${idOrTitle}" not found.`
      const ok = store.toggleDesignBranded(target.id, on)
      return ok ? `${on ? "Marked" : "Unmarked"} branded: ${target.id} • ${target.title}` : "Operation failed."
    }

    return "Unrecognized command. Type 'help' for supported actions."
  }

  const onSend = async () => {
    const msg = input.trim()
    if (!msg) return
    setHistory((h) => [...h, { id: uid(), role: "user", content: msg }])
    setInput("")

    if (aiMode) {
      try {
        const res = await fetch("/api/admin-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg }),
        })
        const data = await res.json()
        // Even in AI mode, execute locally to ensure state updates deterministically.
        const local = localExecute(msg)
        sendAssistantReply(`${data?.text || "AI mode not configured; using local parser."}\n\n${local}`)
        return
      } catch {
        // fallback
      }
    }

    const reply = localExecute(msg)
    sendAssistantReply(reply)
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30 flex items-center justify-center"
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
        }}
        aria-label="Open Admin Assistant"
      >
        <Wand2 className="h-6 w-6 text-white" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl h-full bg-black/80 border-l border-white/10 p-4 flex flex-col"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center"
                    style={{
                      clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-mono font-bold text-sm tracking-wider">NEXUS_ADMIN_ASSISTANT</div>
                    <div className="text-xs text-purple-300 font-mono">Type 'help' for commands • {summary}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
                    <input
                      type="checkbox"
                      checked={aiMode}
                      onChange={(e) => setAiMode(e.target.checked)}
                      className="w-4 h-4 bg-black/50 border border-gray-600"
                    />
                    AI_MODE
                  </label>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 bg-black/40 border border-gray-600 text-white hover:border-purple-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 py-3">
                {history.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-3 py-2 text-sm font-mono leading-relaxed border ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border-purple-500/40"
                          : "bg-black/50 text-gray-100 border-white/10"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hints */}
              <div className="text-[11px] font-mono text-gray-400 mb-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 border border-white/10 inline-flex items-center gap-1">
                  <UserPlus className="h-3 w-3" /> promote u_001
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 inline-flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> navigate products
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 inline-flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> approve d_001 comment: nice
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> add product name: Glass Tee price: 49
                </span>
                <span className="px-2 py-1 bg-white/5 border border-white/10 inline-flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> delete product p_001
                </span>
              </div>

              {/* Composer */}
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command… (help)"
                  className="flex-1 min-h-[44px] max-h-36 p-3 bg-black/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono"
                />
                <button
                  onClick={onSend}
                  className="h-11 px-4 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white font-mono font-bold inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> SEND
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
