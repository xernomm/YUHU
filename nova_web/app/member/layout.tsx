"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BadgeCheck,
  ShoppingBag,
  Store,
  Gift,
  Wallet,
  Settings,
} from "lucide-react";
import { AuthGuard } from "@/components/dashboard/guard";
import { DashboardShell, type NavEntry } from "@/components/dashboard/shell";

const nav: NavEntry[] = [
  { label: "Dashboard", href: "/member", icon: LayoutDashboard, exact: true },
  { label: "Aktivasi", href: "/member/activation", icon: BadgeCheck },
  {
    label: "Belanja Produk",
    icon: ShoppingBag,
    children: [
      { label: "Belanja Produk", href: "/member/shop" },
      { label: "Riwayat Belanja", href: "/member/orders" },
    ],
  },
  {
    label: "Belanja Marketplace",
    icon: Store,
    children: [
      { label: "Belanja Marketplace", href: "/member/marketplace", exact: true },
      {
        label: "Riwayat Belanja Marketplace",
        href: "/member/marketplace/history",
      },
    ],
  },
  {
    label: "Bonus",
    icon: Gift,
    children: [
      { label: "Bonus Cashback", href: "/member/bonus/cashback" },
      { label: "Bonus Tim", href: "/member/bonus/tim" },
      { label: "Bonus Prestasi", href: "/member/bonus/prestasi" },
      { label: "Statement Bonus", href: "/member/bonus/statement" },
    ],
  },
  {
    label: "Saldo",
    icon: Wallet,
    children: [
      { label: "Saldo & Mutasi", href: "/member/saldo/mutasi" },
      { label: "Penarikan Saldo", href: "/member/saldo/penarikan" },
    ],
  },
  { label: "Pengaturan Profile", href: "/member/profile", icon: Settings },
];

const titles: Array<[string, string]> = [
  ["/member/activation", "Aktivasi Akun"],
  ["/member/shop", "Belanja Produk"],
  ["/member/marketplace/history", "Riwayat Belanja Marketplace"],
  ["/member/marketplace", "Belanja Marketplace"],
  ["/member/orders", "Riwayat Belanja"],
  ["/member/bonus/cashback", "Bonus Cashback"],
  ["/member/bonus/tim", "Bonus Tim"],
  ["/member/bonus/prestasi", "Bonus Prestasi"],
  ["/member/bonus/statement", "Statement Bonus"],
  ["/member/saldo/mutasi", "Saldo & Mutasi"],
  ["/member/saldo/penarikan", "Penarikan Saldo"],
  ["/member/profile", "Pengaturan Profile"],
  ["/member/checkout", "Checkout"],
  ["/member", "Dashboard Member"],
];

export default function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const title =
    titles.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    "Dashboard Member";

  return (
    <AuthGuard role="member">
      <DashboardShell nav={nav} title={title}>
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}
