"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import {
  useCartStore,
  cartCount,
  cartSubtotal,
} from "@/lib/stores/cart-store";
import { getProduct } from "@/lib/data/products";
import { discountedPrice, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/*
  The "Frap" — DESIGN.MD's signature floating circular CTA:
  56px, Green Accent fill, layered shadow stack, scale(0.95) press.
  Here it is the persistent cart entry on every shopping surface.
*/
export function FloatingCartButton() {
  const { items, toggle } = useCartStore();
  const count = cartCount(items);

  return (
    <button
      onClick={toggle}
      aria-label={`Keranjang belanja, ${count} item`}
      className="press fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-accent text-snow shadow-frap active:shadow-frap-active"
    >
      <ShoppingBag className="size-6" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-card text-xs font-bold text-brand shadow-card">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

export function CartSidebar() {
  const router = useRouter();
  const { items, isOpen, close, setQty, remove } = useCartStore();
  const subtotal = cartSubtotal(items);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/55"
            onClick={close}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-card shadow-card-hover"
            role="dialog"
            aria-label="Keranjang belanja"
          >
            <div className="flex items-center justify-between border-b border-black/8 p-5">
              <h2 className="text-lg font-semibold text-brand">
                Keranjang Anda
              </h2>
              <button
                onClick={close}
                aria-label="Tutup keranjang"
                className="press rounded-full p-1.5 text-ink-soft hover:bg-black/5"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="rounded-full bg-ceramic p-5 text-ink-soft">
                    <ShoppingBag className="size-8" />
                  </span>
                  <p className="font-semibold text-ink">Keranjang masih kosong</p>
                  <p className="max-w-52 text-sm text-ink-soft">
                    Tambahkan produk dari katalog untuk mulai belanja.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    const price = discountedPrice(
                      product.price,
                      product.discountPercent
                    );
                    return (
                      <li key={item.productId} className="flex gap-3">
                        <div className="relative size-18 shrink-0 overflow-hidden rounded-xl bg-ceramic">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-ink">
                            {product.name}
                          </p>
                          <p className="text-sm font-bold text-brand">
                            {formatRupiah(price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => setQty(item.productId, item.qty - 1)}
                              aria-label="Kurangi jumlah"
                              className="press flex size-8 items-center justify-center rounded-full border border-black/15 text-ink-soft hover:border-accent hover:text-accent"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-ink">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.productId, item.qty + 1)}
                              aria-label="Tambah jumlah"
                              className="press flex size-8 items-center justify-center rounded-full border border-black/15 text-ink-soft hover:border-accent hover:text-accent"
                            >
                              <Plus className="size-3.5" />
                            </button>
                            <button
                              onClick={() => remove(item.productId)}
                              aria-label={`Hapus ${product.name}`}
                              className="press ml-auto rounded-full p-2 text-ink-soft hover:bg-danger/8 hover:text-danger"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-black/8 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft">Subtotal</span>
                  <span className="text-lg font-bold text-brand">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="mt-4 w-full"
                  onClick={() => {
                    close();
                    router.push("/member/checkout");
                  }}
                >
                  Lanjut ke Checkout
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
