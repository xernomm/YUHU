"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, ScrollText } from "lucide-react";
import { codeOfEthics } from "@/lib/data/content";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Label } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ActivationPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [agreed, setAgreed] = React.useState(false);
  const [voucher, setVoucher] = React.useState("");
  const [error, setError] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  if (!user) return null;

  if (user.isActive && !successOpen) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="rounded-full bg-mint p-4 text-brand">
              <BadgeCheck className="size-9" />
            </span>
            <h2 className="text-2xl font-semibold text-brand">
              Akun Anda sudah aktif
            </h2>
            <p className="max-w-md text-ink-soft">
              Anda sudah bisa belanja produk, mengajak mitra, dan menikmati
              seluruh manfaat member Nova.
            </p>
            <Button onClick={() => router.push("/member/shop")}>
              Mulai Belanja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function onActivate() {
    setError("");
    if (!agreed) {
      setError("Anda harus menyetujui kode etik terlebih dahulu.");
      return;
    }
    if (voucher.trim().length < 4) {
      setError("Masukkan kode voucher aktivasi yang valid.");
      return;
    }
    setProcessing(true);
    // Mock activation
    setTimeout(() => {
      updateUser({ isActive: true });
      setProcessing(false);
      setSuccessOpen(true);
    }, 1000);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand">
            <ScrollText className="size-5" /> Kode Etik Member Nova
          </CardTitle>
          <CardDescription>
            Baca seluruh kode etik di bawah ini sebelum melakukan aktivasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 overflow-y-auto rounded-xl bg-canvas p-5">
            <ol className="flex flex-col gap-5">
              {codeOfEthics.map((item) => (
                <li key={item.title}>
                  <h3 className="font-semibold text-brand">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={agreed}
              onCheckedChange={(c) => setAgreed(c === true)}
              className="mt-0.5"
            />
            <span className="text-sm text-ink">
              Saya telah membaca dan <strong>menyetujui kode etik</strong> member
              Nova di atas.
            </span>
          </label>

          <div className="mt-5">
            <Label htmlFor="voucher">Kode Voucher</Label>
            <Input
              id="voucher"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              placeholder="Masukkan kode voucher aktivasi"
            />
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button
            size="lg"
            className="mt-5 w-full sm:w-auto"
            onClick={onActivate}
            disabled={processing}
          >
            <BadgeCheck />
            {processing ? "Memproses…" : "Proses Aktivasi"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <div className="flex flex-col items-center gap-3 pt-2 text-center">
            <span className="rounded-full bg-mint p-4 text-brand">
              <BadgeCheck className="size-10" />
            </span>
            <DialogHeader>
              <DialogTitle className="text-center">
                Aktivasi Berhasil!
              </DialogTitle>
              <DialogDescription className="text-center">
                Selamat, akun Anda kini aktif. Seluruh fitur member — belanja
                produk, komisi, dan jaringan — sudah terbuka.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => router.push("/member")}>
              Ke Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
