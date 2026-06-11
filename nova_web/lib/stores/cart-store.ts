"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";
import { getProduct } from "@/lib/data/products";
import { discountedPrice } from "@/lib/utils";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add(productId, qty = 1) {
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          const items = existing
            ? state.items.map((i) =>
                i.productId === productId ? { ...i, qty: i.qty + qty } : i
              )
            : [...state.items, { productId, qty }];
          return { items, isOpen: true };
        });
      },

      remove(productId) {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      setQty(productId, qty) {
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, qty } : i
                ),
        }));
      },

      clear() {
        set({ items: [] });
      },

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "nova:cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => {
    const product = getProduct(i.productId);
    if (!product) return acc;
    return acc + discountedPrice(product.price, product.discountPercent) * i.qty;
  }, 0);
}
