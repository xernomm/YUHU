"use client";

import * as React from "react";
import { Wallet } from "lucide-react";
import {
  getSaldoState,
  requestWithdrawal,
  defaultBank,
  MIN_WITHDRAWAL,
  ADMIN_FEE,
} from "@/lib/data/saldo";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLocalData } from "@/lib/hooks";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, FieldError } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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

export default function PenarikanSaldoPage() {
  const user = useAuthStore((s) => s.user);
  const [state, reload] = useLocalData(
    () => (user ? getSaldoState(user.id) : null),
    user?.id
  );

  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  if (!user) return null;

  const saldo = state?.saldo ?? 0;
  const withdrawals = state?.withdrawals ?? [];

  // Withdrawals go to the member's registered account (from onboarding);
  // falls back to the demo account when none is saved.
  const onboardingBank = storage.getBankAccount(user.id);
  const bank = onboardingBank
    ? {
        bankName: onboardingBank.bank,
        accountNumber: onboardingBank.accountNumber,
        accountHolder: onboardingBank.accountHolder,
      }
    : defaultBank;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError("");

    const value = Number(amount);
    if (!amount || Number.isNaN(value)) {
      setError("Masukkan nominal penarikan.");
      return;
    }

    const result = requestWithdrawal(user.id, value, bank);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    reload();
    setOpen(false);
    setAmount("");
    setSuccess(
      `Pengajuan penarikan ${formatRupiah(value)} berhasil dikirim dan sedang menunggu pembayaran.`
    );
    setTimeout(() => setSuccess(""), 4000);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      {/* Saldo summary + CTA */}
      <Card className="w-full max-w-sm">
        <CardContent className="flex items-center justify-between gap-4 p-6">
          <div>
            <p className="text-3xl font-bold tracking-tight text-brand">
              {formatRupiah(saldo)}
            </p>
            <p className="mt-1 text-sm text-ink-soft">Saldo</p>
          </div>
          <Button
            onClick={() => {
              setError("");
              setOpen(true);
            }}
          >
            Tarik Saldo <Wallet />
          </Button>
        </CardContent>
      </Card>

      {success && (
        <p className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
          {success}
        </p>
      )}

      {/* Withdrawals table */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-canvas hover:bg-canvas">
                <TableHead>No</TableHead>
                <TableHead>Waktu &amp; Kode Penarikan</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead className="text-right">Total Penarikan</TableHead>
                <TableHead className="text-right">Admin</TableHead>
                <TableHead className="text-right">Nominal Tertransfer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-ink-soft">
                    Belum ada penarikan saldo
                  </TableCell>
                </TableRow>
              )}
              {withdrawals.map((w, i) => (
                <TableRow key={w.code}>
                  <TableCell className="text-ink-soft">{i + 1}</TableCell>
                  <TableCell>
                    <span className="block">{formatWaktu(w.time)}</span>
                    <span className="block text-ink-soft">{w.code}</span>
                  </TableCell>
                  <TableCell>
                    <span className="block">{w.bankName}</span>
                    <span className="block text-ink-soft">{w.accountNumber}</span>
                    <span className="block text-ink-soft">{w.accountHolder}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {w.total.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {w.adminFee.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {w.transferred.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {w.status === "Sudah Dibayarkan" ? (
                      <Badge variant="accent">{w.status}</Badge>
                    ) : (
                      <Badge variant="warning">{w.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-ink-soft">{w.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Penarikan Saldo Member */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Penarikan Saldo Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-sm font-bold text-ink">Saldo Tersedia</p>
                <p className="mt-2 text-lg font-bold text-brand">
                  {formatRupiah(saldo)}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">
                  Informasi Rekening Member
                </p>
                <div className="mt-2 rounded-xl border border-black/10 bg-canvas p-4 text-sm leading-relaxed">
                  <p>
                    <strong>Bank:</strong> {bank.bankName}
                  </p>
                  <p>
                    <strong>No Rekening:</strong> {bank.accountNumber}
                  </p>
                  <p>
                    <strong>Nama Pemilik Rekening:</strong> {bank.accountHolder}
                  </p>
                </div>
                <p className="mt-1.5 text-xs text-ink-soft">
                  Penarikan akan menggunakan rekening member yang terdaftar.
                </p>
              </div>
            </div>

            <div className="max-w-sm">
              <Label htmlFor="nominal">Nominal Penarikan</Label>
              <Input
                id="nominal"
                type="number"
                inputMode="numeric"
                min={MIN_WITHDRAWAL}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Minimal ${MIN_WITHDRAWAL.toLocaleString("id-ID")}`}
                aria-invalid={!!error}
              />
              <FieldError message={error} />
              <p className="mt-1.5 text-xs text-ink-soft">
                Minimal penarikan Rp {MIN_WITHDRAWAL.toLocaleString("id-ID")},
                biaya admin Rp {ADMIN_FEE.toLocaleString("id-ID")}
              </p>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="border border-black/10">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit">Ajukan Penarikan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
