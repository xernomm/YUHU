"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Eye, PackageSearch } from "lucide-react";
import {
  marketplaceOrders,
  type MarketplaceOrder,
} from "@/lib/data/marketplace-orders";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function StatusBadge({ status }: { status: MarketplaceOrder["status"] }) {
  // max-w-full + whitespace-normal: the badge must wrap inside narrow
  // grid columns on mobile instead of stretching the page.
  const wrap = "max-w-full whitespace-normal text-left leading-tight";
  return status === "Komisi Diterima" ? (
    <Badge variant="accent" className={wrap}>
      {status}
    </Badge>
  ) : (
    <Badge variant="warning" className={wrap}>
      ⓘ {status}
    </Badge>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <div className="mt-0.5 text-sm font-bold text-ink">{value}</div>
    </div>
  );
}

export default function MarketplaceHistoryPage() {
  const router = useRouter();
  const [startInput, setStartInput] = React.useState("");
  const [endInput, setEndInput] = React.useState("");
  const [range, setRange] = React.useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [detail, setDetail] = React.useState<MarketplaceOrder | null>(null);

  const filtered = marketplaceOrders.filter((o) => {
    const date = o.createdAt.slice(0, 10);
    if (range.start && date < range.start) return false;
    if (range.end && date > range.end) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header + dropdown */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-brand">
            Riwayat Belanja Marketplace
          </h2>
          <p className="mt-1 text-ink-soft">
            Pantau transaksi marketplace dan status komisi Anda.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="press inline-flex items-center gap-2 rounded-full border border-black/15 bg-card px-4 py-2 text-sm font-semibold text-ink hover:border-accent">
              Riwayat Belanja Marketplace{" "}
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

      <Card>
        <CardContent className="p-5 md:p-7">
          {/* Date filter */}
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setRange({ start: startInput, end: endInput });
            }}
            className="grid grid-cols-2 items-end gap-2.5 lg:grid-cols-[1fr_1fr_auto_auto] lg:gap-3"
          >
            <div className="min-w-0">
              <Label htmlFor="start-date">Tanggal Mulai</Label>
              <Input
                id="start-date"
                type="date"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="min-w-0">
              <Label htmlFor="end-date">Tanggal Selesai</Label>
              <Input
                id="end-date"
                type="date"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <Button type="submit" className="h-11">
              Terapkan Filter
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 border border-black/10"
              onClick={() => {
                setStartInput("");
                setEndInput("");
                setRange({ start: "", end: "" });
              }}
            >
              Reset
            </Button>
          </form>

          {/* Order list */}
          <div className="mt-6 flex flex-col gap-4">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-black/15 p-10 text-center">
                <span className="rounded-full bg-ceramic p-4 text-ink-soft">
                  <PackageSearch className="size-7" />
                </span>
                <p className="font-semibold text-ink">
                  Tidak ada transaksi pada rentang tanggal ini
                </p>
                <p className="max-w-sm text-sm text-ink-soft">
                  Ubah rentang tanggal atau reset filter untuk melihat semua
                  riwayat belanja marketplace Anda.
                </p>
              </div>
            )}

            {filtered.map((order) => (
              <div
                key={order.transactionCode}
                className="rounded-card border border-black/10 p-4 transition-colors hover:border-accent/50 md:p-5"
              >
                {/* Desktop: row · Mobile: stacked */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <span className="text-center font-bold text-ink-soft md:w-6 md:shrink-0">
                    {order.no}
                  </span>

                  <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-xl bg-ceramic md:mx-0 md:size-24">
                    <Image
                      src={order.image}
                      alt={order.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="break-words font-bold leading-snug text-ink">
                      {order.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      Kode Transaksi : {order.transactionCode}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {formatDateTime(order.createdAt)}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">
                      <Stat label="Jumlah" value={order.qty} />
                      <Stat
                        label="Total Belanja"
                        value={formatRupiah(order.total)}
                      />
                      <Stat
                        label="Komisi"
                        value={
                          <span className="text-brand">
                            {formatRupiah(order.commission)}
                          </span>
                        }
                      />
                      <Stat
                        label="Status Komisi"
                        value={<StatusBadge status={order.status} />}
                      />
                    </div>
                  </div>

                  <div className="md:shrink-0 md:self-center">
                    <Button
                      className="w-full md:w-auto"
                      onClick={() => setDetail(order)}
                    >
                      <Eye /> Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          {detail && (
            <>
              <div className="relative mx-auto size-36 overflow-hidden rounded-card bg-ceramic">
                <Image
                  src={detail.image}
                  alt={detail.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="text-lg leading-snug">
                  {detail.name}
                </DialogTitle>
                <DialogDescription>
                  Kode Transaksi : {detail.transactionCode}
                </DialogDescription>
              </DialogHeader>
              <dl className="flex flex-col gap-2.5 rounded-xl bg-canvas p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Tanggal</dt>
                  <dd className="font-semibold text-ink">
                    {formatDateTime(detail.createdAt)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Jumlah</dt>
                  <dd className="font-semibold text-ink">{detail.qty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Total Belanja</dt>
                  <dd className="font-semibold text-ink">
                    {formatRupiah(detail.total)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Komisi</dt>
                  <dd className="font-bold text-brand">
                    {formatRupiah(detail.commission)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-ink-soft">Status Komisi</dt>
                  <dd>
                    <StatusBadge status={detail.status} />
                  </dd>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
