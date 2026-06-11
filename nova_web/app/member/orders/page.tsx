"use client";

import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLocalData } from "@/lib/hooks";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const statusVariant = {
  Diproses: "warning",
  Dikirim: "default",
  Selesai: "accent",
} as const;

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const [data] = useLocalData(
    () => (user ? storage.getOrders(user.id) : []),
    user?.id
  );
  const orders = data ?? [];

  if (!user) return null;

  if (data !== null && orders.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="rounded-full bg-ceramic p-5 text-ink-soft">
              <PackageOpen className="size-8" />
            </span>
            <h2 className="text-xl font-semibold text-ink">
              Belum ada riwayat belanja
            </h2>
            <p className="text-sm text-ink-soft">
              Pesanan pertama Anda akan tampil di sini.
            </p>
            <Button asChild>
              <Link href="/member/shop">Mulai Belanja</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-ink">{order.id}</p>
                <p className="text-xs text-ink-soft">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  • {order.courier} • {order.paymentMethod}
                </p>
              </div>
              <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
            </div>

            <ul className="mt-4 flex flex-col gap-1.5 border-t border-black/6 pt-3 text-sm">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span className="text-ink">
                    {item.name}{" "}
                    <span className="text-ink-soft">× {item.qty}</span>
                  </span>
                  <span className="font-semibold text-ink">
                    {formatRupiah(item.price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-black/6 pt-3">
              <span className="text-sm text-ink-soft">
                Total ({order.items.reduce((a, i) => a + i.qty, 0)} item)
              </span>
              <span className="text-lg font-bold text-brand">
                {formatRupiah(order.total)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
