"use client"

import { motion } from "framer-motion"
import { Users, Package, Images, Shield } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const cards = [
    {
      title: "USER_MANAGEMENT",
      count: "1.2K",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/users",
      hint: "ADM_101",
    },
    {
      title: "PRODUCTS",
      count: "237",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      href: "/dashboard/products",
      hint: "ADM_202",
    },
    {
      title: "DESIGN_QUEUE",
      count: "18",
      icon: Images,
      color: "from-teal-500 to-emerald-500",
      href: "/dashboard/moderation",
      hint: "ADM_303",
    },
    {
      title: "SECURITY",
      count: "ACTIVE",
      icon: Shield,
      color: "from-yellow-500 to-orange-500",
      href: "/dashboard",
      hint: "ADM_SEC",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <Link key={c.title} href={c.href}>
          <motion.div
            className="relative overflow-hidden p-6 border"
            style={{
              background: `
                radial-gradient(circle at 10% 10%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 90% 90%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)
              `,
              borderColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br ${c.color} flex items-center justify-center shadow-xl shadow-black/30 mb-4`}
              style={{
                clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <c.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-white font-mono font-bold text-lg">{c.title}</div>
            <div className="text-3xl font-mono font-black bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent my-2">
              {c.count}
            </div>
            <div className="text-xs text-purple-300 font-mono">{c.hint}</div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
