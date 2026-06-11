"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BonusEntry } from "@/lib/data/bonus";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const PAGE_SIZE = 7;

function formatWaktu(iso: string): string {
  const d = new Date(iso);
  const tanggal = d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${tanggal} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function BonusPage({ entries }: { entries: BonusEntry[] }) {
  const [page, setPage] = React.useState(1);

  const total = entries.reduce((acc, e) => acc + e.nominal, 0);
  const pageCount = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = entries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      {/* Total summary */}
      <Card className="w-full max-w-xs">
        <CardContent className="p-6">
          <p className="text-3xl font-bold tracking-tight text-brand">
            {total.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Total Bonus</p>
        </CardContent>
      </Card>

      {/* Entries table */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-canvas hover:bg-canvas">
                <TableHead>Waktu</TableHead>
                <TableHead>Kode Transaksi</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center text-ink-soft">
                    Data belum tersedia
                  </TableCell>
                </TableRow>
              )}
              {rows.map((entry) => (
                <TableRow key={entry.code}>
                  <TableCell>{formatWaktu(entry.time)}</TableCell>
                  <TableCell className="text-ink-soft">{entry.code}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {entry.nominal.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Halaman sebelumnya"
              className="press rounded-full border border-black/15 p-1.5 text-ink disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                aria-label={`Halaman ${n}`}
                aria-current={n === safePage ? "page" : undefined}
                className={
                  n === safePage
                    ? "press flex size-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-snow"
                    : "press flex size-8 items-center justify-center rounded-full border border-black/15 text-sm font-semibold text-ink hover:border-accent"
                }
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
              aria-label="Halaman berikutnya"
              className="press rounded-full border border-black/15 p-1.5 text-ink disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
