"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, History, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const orderId = useSearchParams().get("order");

  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
              className="rounded-full bg-mint p-5 text-brand"
            >
              <CheckCircle2 className="size-12" />
            </motion.span>
            <h2 className="text-2xl font-semibold tracking-tight text-brand">
              Pesanan Berhasil Dibuat!
            </h2>
            {orderId && (
              <p className="text-sm text-ink-soft">
                Nomor pesanan:{" "}
                <code className="rounded-md bg-canvas px-2 py-0.5 font-bold text-ink">
                  {orderId}
                </code>
              </p>
            )}
            <p className="max-w-md text-ink-soft">
              Terima kasih sudah berbelanja di Nova. Status pesanan dapat Anda
              pantau di halaman Riwayat Belanja.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/member/orders">
                  <History /> Lihat Riwayat
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/member/shop">
                  <ShoppingBag /> Belanja Lagi
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
