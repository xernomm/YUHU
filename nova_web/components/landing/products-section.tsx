"use client";

import { useRouter } from "next/navigation";
import { products } from "@/lib/data/products";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

export function ProductsSection() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Buying from the landing page routes into the member shop —
  // guests go to login first.
  function handleBuy() {
    router.push(user ? "/member/shop" : "/login?next=/member/shop");
  }

  return (
    <section id="produk" className="bg-ceramic py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">
            Produk
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-brand md:text-4xl">
            Produk pilihan yang dibutuhkan sehari-hari
          </h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">
            Kesehatan dan kecantikan berkualitas tinggi — mudah dipakai, mudah
            dijual.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.08}>
              <ProductCard product={product} onBuy={handleBuy} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
