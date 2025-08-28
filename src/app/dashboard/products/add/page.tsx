"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/product-form";

export default function AddProductPage() {
  const router = useRouter();
  return (
    <div className="">
      <ProductForm onSubmitSuccess={() => router.push("/dashboard/products")} />
    </div>
  );
}
