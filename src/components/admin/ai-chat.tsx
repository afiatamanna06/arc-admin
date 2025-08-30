"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Wand2,
  X,
  Navigation,
  Check,
  Trash2,
  UserPlus,
  ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAdminStore } from "./store";
import { useAtom } from "jotai";
import darkModeAtom from "@/atoms/darkModeAtom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type ChatMsg = { id: string; role: "user" | "assistant"; content: string };

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AdminAIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [darkMode] = useAtom(darkModeAtom);
  const isDark = darkMode === "light";
  const [history, setHistory] = useState<ChatMsg[]>([
    {
      id: uid(),
      role: "assistant",
      content:
        "Glammy Admin Assistant online. Try: 'promote u_001', 'add product name: Neon Jacket price: 149 categories: Apparel,Jackets tags: neon,reflective', 'approve d_001 comment: looks great', 'navigate products', 'list designs', or 'help'.",
    },
  ]);
  const [aiMode, setAiMode] = useState(false); // Optional server LLM; falls back to local parser
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const store = useAdminStore();
  const state = useAdminStore((s) => s); // snapshot for summaries

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, open]);

  const sendAssistantReply = (text: string) => {
    setHistory((h) => [...h, { id: uid(), role: "assistant", content: text }]);
  };

  // Helpers
  const findUser = (token: string) => {
    if (token.startsWith("u_")) return store.users.find((u) => u.id === token);
    return store.users.find((u) =>
      u.name.toLowerCase().includes(token.toLowerCase())
    );
  };
  const findProduct = (idOrName: string) => {
    if (idOrName.startsWith("p_"))
      return store.products.find((p) => p.id === idOrName);
    return store.products.find((p) =>
      p.name.toLowerCase().includes(idOrName.toLowerCase())
    );
  };
  const findDesign = (idOrTitle: string) => {
    if (idOrTitle.startsWith("d_"))
      return store.designs.find((d) => d.id === idOrTitle);
    return store.designs.find((d) =>
      d.title.toLowerCase().includes(idOrTitle.toLowerCase())
    );
  };

  const parseKV = (text: string) => {
    // Parses "name: X price: 123 categories: a,b tags: x,y images: url1; url2 description: lorem"
    const pick = (key: string) => {
      const re = new RegExp(
        `${key}\\s*:\\s*([\\s\\S]*?)(?=\\s+\\w+\\s*:|$)`,
        "i"
      );
      const m = text.match(re);
      return m ? m[1].trim() : "";
    };
    const kv = {
      name: pick("name"),
      price: pick("price"),
      categories: pick("categories"),
      tags: pick("tags"),
      images: pick("images"),
      description: pick("description"),
    };
    return kv;
  };

  const summary = useMemo(() => {
    return `Users: ${state.users.length} • Designers: ${
      state.users.filter((u) => u.role === "designer").length
    } • Products: ${state.products.length} • Designs: ${
      state.designs.length
    } (pending: ${state.designs.filter((d) => d.status === "pending").length})`;
  }, [state.users, state.products, state.designs]);

  const localExecute = (raw: string): string => {
    const text = raw.trim();

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
      ].join("\n");
    }

    // NAVIGATE
    const nav = text.match(
      /\b(?:go\s*(?:to)?|open|navigate)\s+(dashboard|user(?:s)?|product(?:s)?|moderation)\b/i
    );

    if (nav) {
      const rawDest = nav[1].toLowerCase();
      console.log("Matched nav:", nav);
      console.log("Raw dest:", rawDest);

      let dest: "dashboard" | "users" | "products" | "moderation";
      if (rawDest.startsWith("user")) dest = "users";
      else if (rawDest.startsWith("product")) dest = "products";
      else if (rawDest.startsWith("moderation")) dest = "moderation";
      else dest = "dashboard";

      const path = dest === "dashboard" ? "/dashboard" : `/dashboard/${dest}`;
      console.log("Navigating to path:", path);
      router.push(path);

      return `Navigating to ${dest.toUpperCase()}...`;
    }

    // SUMMARY
    if (/\bsummary|status|stats\b/i.test(text)) {
      return `System Summary → ${summary}`;
    }

    // LIST
    const ls = text.match(/\b(?:list|show)\s+(users|products|designs)\b/i);
    if (ls) {
      const what = ls[1];
      if (what === "users") {
        return (
          store.users
            .map((u) => `${u.id} • ${u.name} • ${u.email} • ${u.role}`)
            .join("\n") || "No users."
        );
      }
      if (what === "products") {
        return (
          store.products
            .map((p) => `${p.id} • ${p.name} • $${p.price}`)
            .join("\n") || "No products."
        );
      }
      if (what === "designs") {
        return (
          store.designs
            .map(
              (d) =>
                `${d.id} • ${d.title} • ${d.status}${
                  d.branded ? " • branded" : ""
                }`
            )
            .join("\n") || "No designs."
        );
      }
    }

    // PROMOTE USER
    const promoteId = text.match(/\bpromote\s+(u_[a-z0-9]+)\b/i);
    if (promoteId) {
      const ok = store.promoteUserById(promoteId[1]);
      return ok
        ? `Promoted ${promoteId[1]} to DESIGNER.`
        : `User ${promoteId[1]} not found.`;
    }
    const promoteByName = text.match(
      /\bpromote\s+(.+?)\s*(?:to\s+designer)?$/i
    );
    if (promoteByName && !promoteId) {
      const res = store.promoteUserByName(promoteByName[1]);
      return res
        ? `Promoted ${res.name} (${res.id}) to DESIGNER.`
        : `User "${promoteByName[1]}" not found.`;
    }

    // ADD PRODUCT
    if (/\badd\s+product\b/i.test(text)) {
      const kv = parseKV(text);
      const price = Number(kv.price || "0");
      const categories = kv.categories
        ? kv.categories
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const tags = kv.tags
        ? kv.tags
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const images = kv.images
        ? kv.images
            .split(/[;\n,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      if (!kv.name) return "Missing name:. Use 'add product name: ...'";
      const p = store.addProduct({
        name: kv.name,
        description: kv.description || "",
        price,
        categories,
        tags,
        images,
      });
      return `Product created: ${p.id} • ${p.name} • $${p.price}`;
    }

    // EDIT PRODUCT
    const editMatch = text.match(
      /\b(?:edit|update)\s+product\s+([^\s]+)\s*(.*)$/i
    );
    if (editMatch) {
      const idOrName = editMatch[1];
      const target = findProduct(idOrName);
      if (!target) return `Product "${idOrName}" not found.`;
      const rest = editMatch[2];
      const kv = parseKV(rest);
      const price = kv.price ? Number(kv.price) : target.price;
      const categories = kv.categories?.length
        ? kv.categories
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : target.categories;
      const tags = kv.tags?.length
        ? kv.tags
            .split(/[,\n]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : target.tags;
      const images = kv.images?.length
        ? kv.images
            .split(/[;\n,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : target.images;
      const updated = {
        ...target,
        name: kv.name || target.name,
        description: kv.description || target.description,
        price,
        categories,
        tags,
        images,
      };
      const ok = store.updateProduct(updated);
      return ok ? `Updated ${updated.id} • ${updated.name}` : "Update failed.";
    }

    // DELETE PRODUCT
    const delMatch = text.match(/\b(?:delete|remove)\s+product\s+([^\s]+)\b/i);
    if (delMatch) {
      const idOrName = delMatch[1];
      const target = findProduct(idOrName);
      if (!target) return `Product "${idOrName}" not found.`;
      const ok = store.deleteProduct(target.id);
      return ok
        ? `Deleted product ${target.id} • ${target.name}`
        : "Delete failed.";
    }

    // APPROVE / REJECT DESIGN
    const approve = text.match(
      /\bapprove\s+([^\s]+)(?:\s+comment\s*:\s*([\s\S]+))?/i
    );
    if (approve) {
      const idOrTitle = approve[1];
      const comment = approve[2];
      const target = findDesign(idOrTitle);
      if (!target) return `Design "${idOrTitle}" not found.`;
      const ok = store.setDesignStatus(target.id, "approved", comment);
      return ok
        ? `Approved ${target.id} • ${target.title}${
            comment ? ` — ${comment}` : ""
          }`
        : "Approve failed.";
    }
    const reject = text.match(
      /\breject\s+([^\s]+)(?:\s+comment\s*:\s*([\s\S]+))?/i
    );
    if (reject) {
      const idOrTitle = reject[1];
      const comment = reject[2];
      const target = findDesign(idOrTitle);
      if (!target) return `Design "${idOrTitle}" not found.`;
      const ok = store.setDesignStatus(target.id, "rejected", comment);
      return ok
        ? `Rejected ${target.id} • ${target.title}${
            comment ? ` — ${comment}` : ""
          }`
        : "Reject failed.";
    }

    // BRAND ON/OFF
    const brand = text.match(/\bbrand\s+([^\s]+)\s+(on|off)\b/i);
    if (brand) {
      const idOrTitle = brand[1];
      const on = brand[2].toLowerCase() === "on";
      const target = findDesign(idOrTitle);
      if (!target) return `Design "${idOrTitle}" not found.`;
      const ok = store.toggleDesignBranded(target.id, on);
      return ok
        ? `${on ? "Marked" : "Unmarked"} branded: ${target.id} • ${
            target.title
          }`
        : "Operation failed.";
    }

    return "Unrecognized command. Type 'help' for supported actions.";
  };

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
    setHistory((h) => [...h, { id: uid(), role: "user", content: msg }]);
    setInput("");

    if (aiMode) {
      try {
        const res = await fetch("/api/admin-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg }),
        });
        const data = await res.json();
        // Even in AI mode, execute locally to ensure state updates deterministically.
        const local = localExecute(msg);
        sendAssistantReply(
          `${
            data?.text || "AI mode not configured; using local parser."
          }\n\n${local}`
        );
        return;
      } catch {
        // fallback
      }
    }

    const reply = localExecute(msg);
    sendAssistantReply(reply);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30 flex items-center justify-center"
        style={{
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
        }}
        aria-label="Open Admin Assistant"
      >
        <Wand2 className="h-6 w-6 text-white" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-stretch justify-end backdrop-blur-md 
              ${isDark ? "bg-black/40" : "bg-gray-200/40"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl h-full flex flex-col border-l p-4
                ${
                  isDark
                    ? "bg-black/60 border-white/10"
                    : "bg-white/70 border-gray-200"
                }`}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {/* Header */}
              <div
                className={`flex items-start justify-between pb-3 border-b 
                  ${isDark ? "border-white/10" : "border-gray-200"}`}
              >
                <div className="flex flex-col gap-3">
                  <Image
                    src="/icon.png"
                    alt="Logo"
                    width={500}
                    height={500}
                    className="h-12 w-32"
                  />
                  <div>
                    <div
                      className={`font-mono font-bold text-sm tracking-wider 
                        ${isDark ? "text-white" : "text-gray-800"}`}
                    >
                      GLAMMY_ADMIN_ASSISTANT
                    </div>
                    <div
                      className={`text-xs font-mono 
                        ${isDark ? "text-purple-300" : "text-purple-600"}`}
                    >
                      Type 'help' for commands • {/* summary */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    className={`inline-flex items-center gap-2 text-xs font-mono 
                      ${isDark ? "text-purple-300" : "text-purple-600"}`}
                  >
                    <input
                      type="checkbox"
                      checked={aiMode}
                      onChange={(e) => setAiMode(e.target.checked)}
                      className={`w-4 h-4 border 
                        ${
                          isDark
                            ? "bg-black/50 border-gray-600"
                            : "bg-white border-gray-400"
                        }`}
                    />
                    AI_MODE
                  </label>
                  <button
                    onClick={() => setOpen(false)}
                    className={`p-2 border hover:border-purple-400 
                      ${
                        isDark
                          ? "bg-black/40 border-gray-600 text-white"
                          : "bg-gray-100 border-gray-400 text-gray-800"
                      }`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-3 py-3"
              >
                {history.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 text-sm font-mono leading-relaxed border
                        ${
                          m.role === "user"
                            ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-purple-500/40"
                            : isDark
                            ? "bg-black/50 text-gray-100 border-white/10"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hints */}
              <div className="text-[11px] font-mono text-gray-400 mb-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 inline-flex items-center gap-1">
                  <UserPlus className="h-3 w-3" /> promote u_001
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 inline-flex items-center gap-1">
                  <Navigation className="h-3 w-3" /> navigate products
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 inline-flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" /> approve d_001 comment: nice
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 inline-flex items-center gap-1">
                  <Check className="h-3 w-3" /> add product name: Glass Tee
                  price: 49
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 inline-flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> delete product p_001
                </span>
              </div>

              {/* Composer */}

              <form onSubmit={onSend} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command… (help)"
                  aria-label="Chat input"
                  className="w-full outline-none rounded-none transition-colors"
                />

                <div className="relative hidden lg:inline-flex group">
                  {/* Moving glow background */}
                  <div
                    className="absolute -inset-[0.2px] rounded-md blur-md opacity-40 group-hover:opacity-60 transition z-0
                                animate-gradient-move bg-[length:300%_300%] bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"
                  ></div>

                  {/* Actual button */}
                  <Button
                    size="lg"
                    type="submit"
                    className="relative w-[5.5rem] py-4 z-10 flex items-center gap-2 rounded-none bg-gradient-to-br from-purple-500/50 via-blue-500/50 to-teal-500/50 text-white
                                font-semibold shadow-md hover:shadow-lg hover:bg-gradient-to-tl hover:from-purple-500/40 hover:via-blue-500/40 hover:to-teal-500/40 transition duration-300 overflow-hidden"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>

                  {/* Animation style */}
                  <style>{`
                              @keyframes gradientMove {
                                0% {
                                  background-position: 0% 50%;
                                }
                                50% {
                                  background-position: 100% 50%;
                                }
                                100% {
                                  background-position: 0% 50%;
                                }
                              }
              
                              .animate-gradient-move {
                                animation: gradientMove 6s ease infinite;
                              }
                            `}</style>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
