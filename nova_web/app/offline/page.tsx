import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { NovaMark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Anda Sedang Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas p-6 text-center">
      <NovaMark className="size-14" />
      <span className="rounded-full bg-ceramic p-4 text-ink-soft">
        <WifiOff className="size-7" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-brand">
        Anda sedang offline
      </h1>
      <p className="max-w-sm text-ink-soft">
        Koneksi internet terputus. Periksa jaringan Anda, lalu muat ulang
        halaman ini.
      </p>
    </main>
  );
}
