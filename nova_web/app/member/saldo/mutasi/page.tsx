"use client";

import { getSaldoState } from "@/lib/data/saldo";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLocalData } from "@/lib/hooks";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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

export default function SaldoMutasiPage() {
  const user = useAuthStore((s) => s.user);
  const [state] = useLocalData(
    () => (user ? getSaldoState(user.id) : null),
    user?.id
  );

  const saldo = state?.saldo ?? 0;
  const mutations = state?.mutations ?? [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      {/* Saldo summary */}
      <Card className="w-full max-w-xs">
        <CardContent className="p-6">
          <p className="text-3xl font-bold tracking-tight text-brand">
            {formatRupiah(saldo)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">Saldo</p>
        </CardContent>
      </Card>

      {/* Mutations table */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-canvas hover:bg-canvas">
                <TableHead>No</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
                <TableHead className="text-right">Saldo Akhir</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mutations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-ink-soft">
                    Data belum tersedia
                  </TableCell>
                </TableRow>
              )}
              {mutations.map((m, i) => (
                <TableRow key={`${m.time}-${i}`}>
                  <TableCell className="text-ink-soft">{i + 1}</TableCell>
                  <TableCell>{formatWaktu(m.time)}</TableCell>
                  <TableCell>
                    {m.type === "Masuk" ? (
                      <Badge variant="accent">Masuk</Badge>
                    ) : (
                      <Badge className="border-transparent bg-danger text-snow">
                        Keluar
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {m.nominal.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {m.saldoAkhir.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal text-ink-soft">
                    {m.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
