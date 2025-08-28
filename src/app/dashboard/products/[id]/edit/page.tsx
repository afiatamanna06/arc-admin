"use client";

import { useParams, useRouter } from "next/navigation";
import { useAdminStore } from "@/components/admin/store";
import ProductForm from "@/components/products/product-form";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products } = useAdminStore();
  const product = products.find((p) => p.id === id);

  if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <div className="">
      <ProductForm
        initial={product as any}
        onSubmitSuccess={() => router.push("/dashboard/products")}
      />
    </div>
  );
}
