"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/product-form";

export default function AddProductPage() {
  const router = useRouter();
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>
      <ProductForm onSubmitSuccess={() => router.push("/dashboard/products")} />
    </div>
  );
}
