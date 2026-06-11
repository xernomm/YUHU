"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Ticket, Truck, Wallet, ShoppingBag } from "lucide-react";
import { couriers, paymentMethods } from "@/lib/data/content";
import { getProduct } from "@/lib/data/products";
import { storage } from "@/lib/storage";
import { createOrder } from "@/lib/factories";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore, cartSubtotal } from "@/lib/stores/cart-store";
import { cn, discountedPrice, formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";

// Mock voucher codes
const vouchers: Record<string, number> = {
  NOVA10: 10_000,
  NOVA25: 25_000,
};

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, clear } = useCartStore();

  // Prefill from onboarding data; AuthGuard guarantees this renders
  // client-side only, so reading storage in the initializer is safe.
  const [address, setAddress] = React.useState(() => {
    const bank = user ? storage.getBankAccount(user.id) : null;
    return bank
      ? `${bank.addressDetail}, ${bank.village}, ${bank.district}, ${bank.regency}, ${bank.province}`
      : "";
  });
  const [courierId, setCourierId] = React.useState<string>(couriers[0].id);
  const [paymentId, setPaymentId] = React.useState<string>(paymentMethods[0].id);
  const [voucherInput, setVoucherInput] = React.useState("");
  const [voucherApplied, setVoucherApplied] = React.useState(0);
  const [voucherMsg, setVoucherMsg] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  if (!user) return null;

  const subtotal = cartSubtotal(items);
  const courier = couriers.find((c) => c.id === courierId) ?? couriers[0];
  const total = Math.max(0, subtotal + courier.price - voucherApplied);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="rounded-full bg-ceramic p-5 text-ink-soft">
              <ShoppingBag className="size-8" />
            </span>
            <h2 className="text-xl font-semibold text-ink">
              Keranjang Anda kosong
            </h2>
            <p className="text-sm text-ink-soft">
              Tambahkan produk terlebih dahulu sebelum checkout.
            </p>
            <Button onClick={() => router.push("/member/shop")}>
              Ke Katalog Produk
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function applyVoucher() {
    const code = voucherInput.trim().toUpperCase();
    const amount = vouchers[code];
    if (!amount) {
      setVoucherApplied(0);
      setVoucherMsg("Kode voucher tidak ditemukan. Coba NOVA10.");
      return;
    }
    setVoucherApplied(amount);
    setVoucherMsg(`Voucher ${code} diterapkan — potongan ${formatRupiah(amount)}.`);
  }

  function onCheckout() {
    if (!user || address.trim().length < 8) return;
    setSubmitting(true);
    const payment =
      paymentMethods.find((p) => p.id === paymentId) ?? paymentMethods[0];

    const order = createOrder({
      userId: user.id,
      items: items.map((i) => {
        const p = getProduct(i.productId)!;
        return {
          productId: p.id,
          name: p.name,
          price: discountedPrice(p.price, p.discountPercent),
          qty: i.qty,
        };
      }),
      subtotal,
      shipping: courier.price,
      discount: voucherApplied,
      total,
      courier: courier.name,
      paymentMethod: payment.name,
    });

    // Mock processing
    setTimeout(() => {
      storage.addOrder(order);
      clear();
      router.push(`/member/checkout/success?order=${order.id}`);
    }, 900);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-6">
        {/* Alamat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand">
              <MapPin className="size-5" /> Alamat Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, provinsi"
            />
            {address.trim().length < 8 && (
              <p className="mt-1.5 text-xs text-ink-soft">
                Isi alamat lengkap agar paket sampai dengan benar.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Kurir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand">
              <Truck className="size-5" /> Pilih Kurir
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {couriers.map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors",
                  courierId === c.id
                    ? "border-accent bg-mint/30"
                    : "border-black/10 hover:border-black/25"
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="courier"
                    value={c.id}
                    checked={courierId === c.id}
                    onChange={() => setCourierId(c.id)}
                    className="size-4 accent-[#00754a]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {c.name}
                    </span>
                    <span className="block text-xs text-ink-soft">
                      Estimasi {c.eta}
                    </span>
                  </span>
                </span>
                <span className="text-sm font-bold text-brand">
                  {formatRupiah(c.price)}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Pembayaran */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand">
              <Wallet className="size-5" /> Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {paymentMethods.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                  paymentId === p.id
                    ? "border-accent bg-mint/30"
                    : "border-black/10 hover:border-black/25"
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={p.id}
                  checked={paymentId === p.id}
                  onChange={() => setPaymentId(p.id)}
                  className="size-4 accent-[#00754a]"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {p.name}
                  </span>
                  <span className="block text-xs text-ink-soft">{p.detail}</span>
                </span>
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan */}
      <div className="lg:sticky lg:top-22 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-brand">Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                const price = discountedPrice(
                  product.price,
                  product.discountPercent
                );
                return (
                  <li key={item.productId} className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-ceramic">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">
                        {product.name}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {item.qty} × {formatRupiah(price)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-ink">
                      {formatRupiah(price * item.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Voucher */}
            <div className="mt-5">
              <Label htmlFor="voucher" className="flex items-center gap-1.5">
                <Ticket className="size-3.5" /> Voucher
              </Label>
              <div className="flex gap-2">
                <Input
                  id="voucher"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="cth. NOVA10"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={applyVoucher}>
                  Pakai
                </Button>
              </div>
              {voucherMsg && (
                <p
                  className={cn(
                    "mt-1.5 text-xs font-medium",
                    voucherApplied > 0 ? "text-accent" : "text-danger"
                  )}
                >
                  {voucherMsg}
                </p>
              )}
            </div>

            <dl className="mt-5 flex flex-col gap-2 border-t border-black/8 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatRupiah(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Ongkir ({courier.name})</dt>
                <dd className="font-semibold text-ink">
                  {formatRupiah(courier.price)}
                </dd>
              </div>
              {voucherApplied > 0 && (
                <div className="flex justify-between text-accent">
                  <dt>Diskon voucher</dt>
                  <dd className="font-semibold">-{formatRupiah(voucherApplied)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-black/8 pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-bold text-brand">{formatRupiah(total)}</dd>
              </div>
            </dl>

            <Button
              size="lg"
              className="mt-5 w-full"
              onClick={onCheckout}
              disabled={submitting || address.trim().length < 8}
            >
              {submitting ? "Memproses pesanan…" : "Checkout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
