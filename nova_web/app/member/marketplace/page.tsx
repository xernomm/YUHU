"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { MarketplaceCard } from "@/components/member/marketplace-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function MarketplacePage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-brand">
            Belanja Marketplace
          </h2>
          <p className="mt-1 text-ink-soft">
            Cek detail produk dari marketplace favorit Anda.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="press inline-flex items-center gap-2 rounded-full border border-black/15 bg-card px-4 py-2 text-sm font-semibold text-ink hover:border-accent">
              Belanja Marketplace{" "}
              <ChevronDown className="size-4 text-ink-soft" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/member/marketplace")}>
              Belanja Marketplace
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/member/marketplace/history")}
            >
              Riwayat Belanja Marketplace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MarketplaceCard />
    </div>
  );
}
