"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
} from "lucide-react";
import { AuthGuard } from "@/components/dashboard/guard";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const nav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Member Profile", href: "/admin/members", icon: Users },
  { label: "Butuh Aktivasi", href: "/admin/activations", icon: UserCheck },
  { label: "Pengaturan Profile", href: "/admin/settings", icon: Settings },
];

const titles: Array<[string, string]> = [
  ["/admin/members", "Member Profile"],
  ["/admin/activations", "Butuh Aktivasi"],
  ["/admin/settings", "Pengaturan Profile"],
  ["/admin", "Dashboard Admin"],
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const title =
    titles.find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    "Dashboard Admin";

  return (
    <AuthGuard role="admin">
      <DashboardShell nav={nav} title={title}>
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}
