"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import {
  LayoutGrid,
  Users,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AdminAIChatWidget from "./ai-chat";
import ColorModeSwitch from "../common/ColorModeSwitch";

const nav = [
  { href: "/dashboard", label: "DASHBOARD", icon: LayoutGrid, code: "ADM_000" },
  { href: "/dashboard/users", label: "USERS", icon: Users, code: "ADM_101" },
  {
    href: "/dashboard/products",
    label: "PRODUCTS",
    icon: Package,
    code: "ADM_202",
  },
  // {
  //   href: "/dashboard/moderation",
  //   label: "MODERATION",
  //   icon: Images,
  //   code: "ADM_303",
  // },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin-auth");
    router.replace("/login");
  };

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden bg-[#f8f7ff] dark:bg-[#1a1a2e]"
      )}
    >
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-32 bg-gradient-to-b from-purple-500 via-blue-500 to-teal-500 opacity-60 animate-pulse" />
        <div className="absolute top-40 right-32 w-32 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-60 animate-pulse" />
        <div className="absolute bottom-32 left-1/3 w-2 h-24 bg-gradient-to-b from-teal-500 via-blue-500 to-purple-500 opacity-60 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 opacity-60 animate-pulse" />
      </div>

      <div className="flex h-screen relative z-10">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          className={cn(
            "fixed lg:relative z-50 w-80 lg:w-80 transition-all duration-300 ease-in-out",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
            // Background
            "backdrop-blur-xl border-r shadow-lg",
            // Light mode
            "bg-[radial-gradient(circle_at_10%_20%,rgba(168,85,247,.18)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.18)_0%,transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.8)_100%)]",
            "border-r-[rgba(168,85,247,0.2)] shadow-[4px_0_24px_rgba(0,0,0,0.1),inset_-1px_0_0_rgba(255,255,255,0.8)]",
            // Dark mode
            "dark:bg-[radial-gradient(circle_at_10%_20%,rgba(168,85,247,0.18)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.2)_0%,transparent_50%),linear-gradient(135deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.6)_100%)]",
            "dark:border-r-[rgba(168,85,247,0.3)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.3),inset_-1px_0_0_rgba(255,255,255,0.1)]"
          )}
          initial={false}
        >
          <div className="p-5 lg:p-6 relative z-10 h-full overflow-y-auto">
            <button
              className="lg:hidden absolute top-4 right-4 p-2 dark:text-white hover:text-purple-400 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col gap-4 mb-6">
              <Image
                src="/icon.png"
                alt="Logo"
                width={500}
                height={500}
                className="h-12 w-32"
              />

              <div className="dark:text-white font-mono font-bold">
                ADMIN PANEL
              </div>
            </div>

            <nav className="flex flex-col gap-3 mb-6">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div
                      className={cn(
                        "w-full flex items-center gap-3 p-3 font-mono text-sm tracking-wider transition-all duration-300 border",
                        active
                          ? "bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 border-purple-500/50 text-purple-500 dark:text-purple-400 shadow-lg shadow-purple-500/25"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-500/5 dark:hover:text-white dark:hover:bg-white/5 border-transparent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <span className="text-xs opacity-60 hidden lg:block">
                        {item.code}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-3 border-t dark:border-white/10 flex items-center justify-between">
              <button
                onClick={logout}
                className="px-3 py-2.5 w-full justify-center bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs hover:border-red-400 transition-all inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                LOGOUT
              </button>
            </div>
          </div>
        </motion.aside>

        <div className="flex-1 overflow-auto">
          <div
            className={cn(
              "px-4 lg:px-6 py-2.5 relative backdrop-blur-xl border-b",
              // Light mode
              "bg-[radial-gradient(circle_at_10%_20%,rgba(168,85,247,.1)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.1)_0%,transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.8)_100%)]",
              "border-r-[rgba(168,85,247,0.2)] shadow-[4px_0_24px_rgba(0,0,0,0.1),inset_-1px_0_0_rgba(255,255,255,0.8)]",
              // Dark mode
              "dark:bg-[radial-gradient(circle_at_10%_20%,rgba(168,85,247,0.18)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.2)_0%,transparent_50%),linear-gradient(135deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.5)_100%)]",
              "dark:border-r-[rgba(168,85,247,0.3)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.3),inset_-1px_0_0_rgba(255,255,255,0.1)]"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 dark:text-white hover:text-purple-400 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-mono font-bold dark:text-white tracking-wider mb-1">
                    {nav.find((n) => n.href === pathname)?.label ?? "ADMIN"}
                  </h1>
                  <p className="text-purple-400 font-mono text-xs lg:text-sm">
                    Date: {new Date().toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
              <ColorModeSwitch className="bg-purple-200 dark:bg-purple-500/20 p-2 cursor-pointer rounded-full text-purple-600 dark:text-white" />
            </div>
          </div>

          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <AdminAIChatWidget />
    </div>
  );
}
