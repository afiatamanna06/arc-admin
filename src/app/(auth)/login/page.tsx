"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Shield, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const isDark = true

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    if (email.toLowerCase() === "admin@arc.com" && password === "1234") {
      localStorage.setItem("admin-auth", "true")
      setSuccess(true)
      setTimeout(() => router.replace("/dashboard"), 600)
    } else {
      setError("INVALID_ADMIN_CREDENTIALS")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-2 h-32 bg-gradient-to-b from-purple-500 via-blue-500 to-teal-500 opacity-60 animate-pulse" />
        <div className="absolute top-40 right-32 w-32 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-60 animate-pulse" />
        <div className="absolute bottom-32 left-1/3 w-2 h-24 bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500 opacity-60 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 opacity-60 animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md relative overflow-hidden p-8"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)
            `,
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.15)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-purple-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-blue-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-teal-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-purple-400" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-mono font-bold text-xl">ADMIN_LOGIN</h1>
              <p className="text-purple-400 font-mono text-xs">NEXUS_SYSTEM</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono tracking-wider text-cyan-400">ADMIN_EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="admin@nexus.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono tracking-wider text-cyan-400">ADMIN_PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
                <CheckCircle className="h-4 w-4" />
                ACCESS_GRANTED
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white font-mono font-bold tracking-wider shadow-lg shadow-purple-500/25 relative overflow-hidden disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <span className="relative z-10 inline-flex items-center gap-2 justify-center">
                {loading ? "VERIFYING..." : "ENTER_PANEL"}
                <ArrowRight className="h-4 w-4" />
              </span>
            </motion.button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/" className="text-purple-400 hover:text-purple-300 font-mono text-xs underline">
              BACK_TO_SITE
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
