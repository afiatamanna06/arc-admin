"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import ColorModeSwitch from "@/components/common/ColorModeSwitch";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (email.toLowerCase() === "admin@glammy.com" && password === "1234") {
      localStorage.setItem("admin-auth", "true");
      setSuccess(true);
      setTimeout(() => router.replace("/dashboard"), 600);
    } else {
      setError("INVALID_ADMIN_CREDENTIALS");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <ColorModeSwitch className="bg-purple-200 dark:bg-purple-500/20 p-3 cursor-pointer rounded-full text-purple-600 dark:text-white" />
        </div>
        <motion.div
          className="
  w-full max-w-md relative overflow-hidden p-8
  border-[rgba(255,255,255,0.2)]
  backdrop-blur-[25px]
  shadow-[0_20px_40px_rgba(168,85,247,.2),_inset_0_2px_0_rgba(255,255,255,0.15)]
  [background:radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.25)_0%,transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)]
  
  dark:border-[rgba(255,255,255,0.1)]
  dark:shadow-[0_20px_40px_rgba(168,85,247,0.2),_inset_0_2px_0_rgba(255,255,255,0.05)]
  dark:[background:radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.2)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.4)_0%,transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.05)_100%)]
"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-4 mb-6">
            <Image
              src="/icon.png"
              alt="Logo"
              width={500}
              height={500}
              className="h-12 w-32"
            />

            <h1 className="font-mono font-bold text-xl">ADMIN LOGIN</h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono tracking-wider text-cyan-400">
                ADMIN_EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="admin@abcd.com"
                  className="w-full pl-10 pr-4 py-3 dark:bg-black/50 border border-gray-600 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono tracking-wider text-cyan-400">
                ADMIN_PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 dark:bg-black/50 border border-gray-600 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/25 font-mono"
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

            <div className="relative inline-flex group w-full mt-2">
              {/* Moving glow background */}
              <div
                className="absolute -inset-[0.2px] rounded-md blur-md opacity-40 group-hover:opacity-60 transition z-0
                                animate-gradient-move bg-[length:300%_300%] bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"
              ></div>

              {/* Actual button */}
              <Button
                size="lg"
                type="submit"
                disabled={loading}
                className="relative w-full py-6 text-base z-10 flex items-center gap-2 rounded-none bg-gradient-to-br from-purple-500/50 via-blue-500/50 to-teal-500/50 text-white
                                font-semibold shadow-md hover:shadow-lg hover:bg-gradient-to-tl hover:from-purple-500/40 hover:via-blue-500/40 hover:to-teal-500/40 transition duration-300 overflow-hidden"
              >
                {loading ? "VERIFYING..." : "ENTER PANEL"}
                <ArrowRight className="h-4 w-4" />
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
      </div>
    </div>
  );
}
