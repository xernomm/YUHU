"use client";

import * as React from "react";
import Image from "next/image";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, discountedPrice, formatRupiah } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function ProductCard({
  product,
  onBuy,
  buyLabel = "Beli",
  className,
}: {
  product: Product;
  onBuy: (product: Product) => void;
  buyLabel?: string;
  className?: string;
}) {
  const [detailOpen, setDetailOpen] = React.useState(false);
  const finalPrice = discountedPrice(product.price, product.discountPercent);

  return (
    <>
      <Card
        className={cn(
          "group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-card-hover",
          className
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-ceramic">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.discountPercent > 0 && (
            <Badge variant="accent" className="absolute left-3 top-3 shadow-card">
              Hemat {product.discountPercent}%
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
            {product.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink">{product.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand">
              {formatRupiah(finalPrice)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-sm text-ink-soft line-through">
                {formatRupiah(product.price)}
              </span>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setDetailOpen(true)}
            >
              <Eye /> Detail
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onBuy(product)}>
              <ShoppingBag /> {buyLabel}
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <div className="relative mx-auto aspect-square w-44 overflow-hidden rounded-card bg-ceramic">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>{product.description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between rounded-xl bg-canvas p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
                Harga
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-brand">
                  {formatRupiah(finalPrice)}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-sm text-ink-soft line-through">
                    {formatRupiah(product.price)}
                  </span>
                )}
              </div>
            </div>
            {product.discountPercent > 0 && (
              <Badge variant="accent">Diskon {product.discountPercent}%</Badge>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setDetailOpen(false);
                onBuy(product);
              }}
            >
              <ShoppingBag /> {buyLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
