"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/lib/stores/cart-store";
import { ProductCard } from "@/components/product/product-card";
import { FloatingCartButton, CartSidebar } from "@/components/shop/cart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ShopPage() {
  const router = useRouter();
  const add = useCartStore((s) => s.add);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-brand">
            Katalog Produk
          </h2>
          <p className="mt-1 text-ink-soft">
            Harga member sudah termasuk diskon khusus Anda.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="press inline-flex items-center gap-2 rounded-full border border-black/15 bg-card px-4 py-2 text-sm font-semibold text-ink hover:border-accent">
              Belanja Produk <ChevronDown className="size-4 text-ink-soft" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/member/shop")}>
              Belanja Produk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/member/orders")}>
              Riwayat Belanja
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            buyLabel="Tambah"
            onBuy={(p) => add(p.id)}
          />
        ))}
      </div>

      <FloatingCartButton />
      <CartSidebar />
    </div>
  );
}
