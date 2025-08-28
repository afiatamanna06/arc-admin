"use client";

import { useAdminStore } from "@/components/admin/store";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

export default function UsersPage() {
  const users = useAdminStore((s) => s.users);
  const promoteUserById = useAdminStore((s) => s.promoteUserById);

  const promote = (id: string) => {
    promoteUserById(id);
  };

  return (
    <div className="space-y-6">
      <div
        className={`
          relative overflow-hidden p-4
          border backdrop-blur-[20px] 
          border-white/20 dark:border-white/10
          bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.15)_0%,transparent_60%),linear-gradient(135deg,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.02)_100%)]
          dark:bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25)_0%,transparent_60%),linear-gradient(135deg,rgba(255,255,255,0.01)_0%,rgba(255,255,255,0.01)_100%)]
        `}
      >
        <div className="dark:text-white font-mono font-bold">
          USER DESIGNER MANAGEMENT
        </div>
        <div className="text-xs text-purple-500 dark:text-purple-400 font-mono">
          PROMOTE TO DESIGNER
        </div>
      </div>

      <div
        className="relative overflow-hidden border"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-purple-500 dark:text-purple-400 font-mono">
                <th className="px-4 py-3">USER_ID</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">EMAIL</th>
                <th className="px-4 py-3">ROLE</th>
                <th className="px-4 py-3">JOINED</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-t border-white/10"
                >
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {u.id}
                  </td>
                  <td className="px-4 py-3 text-sm dark:text-white font-mono">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">
                    <span
                      className={`px-2 py-1 text-sm ${
                        u.role === "designer"
                          ? "text-green-500 dark:text-green-400"
                          : "text-yellow-500 dark:text-yellow-400"
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {u.joinedAt}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => promote(u.id)}
                      disabled={u.role === "designer"}
                      className="inline-flex items-center gap-2 px-3 py-2 dark:bg-black/40 border border-purple-500/70 cursor-pointer text-purple-500 dark:text-purple-400 font-mono text-xs hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserPlus className="h-4 w-4" />
                      PROMOTE
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
