"use client";

import { motion } from "framer-motion";
import { Users, Package, Images, Shield } from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { initialUsers } from "@/components/admin/mock-data";
import { useAdminStore } from "@/components/admin/store";

export default function AdminDashboard() {
  const { products } = useAdminStore();
  // ----- Stats -----
  const totalUsers = initialUsers.length;
  const designers = initialUsers.filter((u) => u.role === "designer").length;
  const totalProducts = products.length;
  const publishedProducts = products.filter(
    (p) => p.status === "published"
  ).length;
  const draftProducts = products.filter((p) => p.status === "draft").length;
  const inStockProducts = products.filter((p) => p.inStock).length;

  // ----- Data for Charts -----
  const productStatusData = [
    { name: "Published", value: publishedProducts },
    { name: "Draft", value: draftProducts },
    {
      name: "Archived",
      value: products.filter((p) => p.status === "archived").length,
    },
  ];

  const stockData = [
    { name: "In Stock", value: inStockProducts },
    { name: "Out of Stock", value: totalProducts - inStockProducts },
  ];

  const userRoleData = [
    { name: "Designers", value: designers },
    { name: "Users", value: totalUsers - designers },
  ];

  // ----- Cards -----
  const cards = [
    {
      title: "Users",
      count: totalUsers,
      hint: `${designers} designer${designers !== 1 ? "s" : ""}`,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      href: "/admin/users",
    },
    {
      title: "Products",
      count: totalProducts,
      hint: `${publishedProducts} published, ${draftProducts} drafts`,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      href: "/admin/products",
    },
    {
      title: "In Stock",
      count: inStockProducts,
      hint: `${totalProducts - inStockProducts} out of stock`,
      icon: Images,
      color: "from-green-500 to-emerald-500",
      href: "/admin/inventory",
    },
    {
      title: "Roles",
      count: 2,
      hint: "Users & Designers",
      icon: Shield,
      color: "from-yellow-500 to-orange-500",
      href: "/admin/roles",
    },
  ];

  const COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981"];

  return (
    <div className="space-y-10 p-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <Link key={c.title} href={c.href}>
            <motion.div
              className="
  relative overflow-hidden p-6 border 
  border-[rgba(255,255,255,0.2)] 
  backdrop-blur-[20px] 
  shadow-[0_12px_30px_rgba(59,130,246,0.2),_inset_0_2px_0_rgba(255,255,255,0.1)] 
  [background:radial-gradient(circle_at_10%_10%,rgba(168,85,247,0.15)_0%,transparent_50%),radial-gradient(circle_at_90%_90%,rgba(59,130,246,0.1)_0%,transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.02)_100%)]
  
  dark:border-[rgba(255,255,255,0.1)]
  dark:shadow-[0_12px_30px_rgba(59,130,246,0.2),_inset_0_2px_0_rgba(255,255,255,0.05)] 
  dark:[background:radial-gradient(circle_at_10%_10%,rgba(168,85,247,0.3)_0%,transparent_50%),radial-gradient(circle_at_90%_90%,rgba(59,130,246,0.15)_0%,transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]
"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${c.color} flex items-center justify-center shadow-xl shadow-black/30 mb-4`}
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                }}
              >
                <c.icon className="h-6 w-6 text-white" />
              </div>
              <div className="dark:text-white font-mono font-bold text-lg">
                {c.title}
              </div>
              <div className="text-3xl font-mono font-black bg-gradient-to-b from-purple-500/60 to-teal-500/60 bg-clip-text text-transparent my-2">
                {c.count}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-400 font-mono">
                {c.hint}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-transparent p-6 shadow-xl shadow-purple-100 dark:shadow-purple-800/30">
          <h2 className="text-sm font-bold mb-4">Product Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {productStatusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-transparent p-6 shadow-xl shadow-teal-100 dark:shadow-teal-800/30">
          <h2 className="text-sm font-bold mb-4">Stock Availability</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stockData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stockData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-transparent p-6 shadow-xl shadow-blue-100 dark:shadow-blue-800/30">
          <h2 className="text-sm font-bold mb-4">User Roles</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userRoleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-transparent p-6 shadow-xl shadow-indigo-100 dark:shadow-indigo-800/30">
          <h2 className="text-sm font-bold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead className="text-left text-gray-400">
                <tr>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {initialUsers.slice(0, 4).map((u) => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2 text-gray-400">{u.email}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-transparent h-min p-6 shadow-xl shadow-violet-100 dark:shadow-violet-800/30">
          <h2 className="text-sm font-bold mb-4">Recent Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[350px] text-sm">
              <thead className="text-left text-gray-400">
                <tr>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 4).map((p) => (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="py-2 flex items-center gap-2">{p.name}</td>
                    <td className="py-2">${p.price}</td>
                    <td className="py-2 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
