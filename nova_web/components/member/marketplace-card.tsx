"use client";

import * as React from "react";
import { ExternalLink, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ParsedProduct {
  source: "Shopee" | "ShopeeFood";
  name: string;
  shopId?: string;
  itemId?: string;
  url: string;
}

// Supported link shapes:
//   https://s.shopee.co.id/8KmLiwTfBx              (short link)
//   https://shopee.co.id/Nama-Produk-i.123456.123456 (product link)
//   https://spf.shopee.co.id/1qYro2xgR             (ShopeeFood)
function parseMarketplaceLink(raw: string): ParsedProduct | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  if (url.hostname === "spf.shopee.co.id" && url.pathname.length > 1) {
    return {
      source: "ShopeeFood",
      name: "Produk ShopeeFood",
      url: url.href,
    };
  }

  if (url.hostname === "s.shopee.co.id" && url.pathname.length > 1) {
    return {
      source: "Shopee",
      name: "Produk Shopee",
      url: url.href,
    };
  }

  if (url.hostname === "shopee.co.id") {
    const match = url.pathname.match(/^\/(.+)-i\.(\d+)\.(\d+)$/);
    if (match) {
      return {
        source: "Shopee",
        name: decodeURIComponent(match[1]).replace(/-/g, " "),
        shopId: match[2],
        itemId: match[3],
        url: url.href,
      };
    }
  }

  return null;
}

export function MarketplaceCard() {
  const [link, setLink] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState<ParsedProduct | null>(null);

  function onDetail(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!link.trim()) {
      setError("Tempel link produk terlebih dahulu.");
      return;
    }

    const parsed = parseMarketplaceLink(link);
    if (!parsed) {
      setError(
        "Link tidak dikenali. Gunakan link produk Shopee atau ShopeeFood seperti pada contoh."
      );
      return;
    }

    setLoading(true);
    // Mock lookup — real product data arrives with backend integration.
    setTimeout(() => {
      setLoading(false);
      setProduct(parsed);
    }, 700);
  }

  return (
    <>
      <Card>
        <CardContent className="p-6 md:p-8">
          <h3 className="text-lg font-semibold text-ink">Belanja Marketplace</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Salin link produk dari Shopee atau Toko ShopeeFood, lalu klik
            Detail untuk melihat informasi produk.
          </p>

          <form onSubmit={onDetail} noValidate className="mt-5">
            <Label htmlFor="marketplace-link">
              Link Produk Shopee / ShopeeFood
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="marketplace-link"
                type="url"
                inputMode="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://s.shopee.co.id/... atau https://shopee.co.id/..."
                aria-invalid={!!error}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading}
                className="sm:w-36"
              >
                <Search /> {loading ? "Memuat…" : "Detail"}
              </Button>
            </div>
            <FieldError message={error} />
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Contoh: https://s.shopee.co.id/8KmLiwTfBx,
              https://shopee.co.id/Nama-Produk-i.123456.123456 atau
              https://spf.shopee.co.id/1qYro2xgR
            </p>
          </form>
        </CardContent>
      </Card>

      <Dialog open={!!product} onOpenChange={(o) => !o && setProduct(null)}>
        <DialogContent>
          {product && (
            <>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-mint p-3 text-brand">
                  {product.source === "ShopeeFood" ? (
                    <UtensilsCrossed className="size-6" />
                  ) : (
                    <ShoppingBag className="size-6" />
                  )}
                </span>
                <Badge>{product.source}</Badge>
              </div>
              <DialogHeader>
                <DialogTitle className="capitalize">{product.name}</DialogTitle>
                <DialogDescription>
                  Informasi dasar berhasil dibaca dari link. Detail lengkap
                  produk (harga, stok, rating) akan tersedia saat integrasi
                  backend aktif.
                </DialogDescription>
              </DialogHeader>

              <dl className="flex flex-col gap-2 rounded-xl bg-canvas p-4 text-sm">
                {product.shopId && (
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">ID Toko</dt>
                    <dd className="font-semibold text-ink">{product.shopId}</dd>
                  </div>
                )}
                {product.itemId && (
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">ID Produk</dt>
                    <dd className="font-semibold text-ink">{product.itemId}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <dt className="shrink-0 text-ink-soft">Link</dt>
                  <dd className="truncate font-medium text-accent">
                    {product.url}
                  </dd>
                </div>
              </dl>

              <DialogFooter>
                <Button variant="outline" onClick={() => setProduct(null)}>
                  Tutup
                </Button>
                <Button asChild>
                  <a href={product.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink /> Buka di {product.source}
                  </a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
