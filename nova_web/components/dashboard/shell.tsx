"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Maximize,
  Menu,
  Minimize,
  X,
  type LucideIcon,
} from "lucide-react";
import { NovaLogo, NovaMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  children: Array<{ label: string; href: string; exact?: boolean }>;
}

export type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const dummyNotifications = [
  { title: "Selamat datang di Nova!", time: "Baru saja" },
  { title: "Promo Juni: gratis ongkir min. belanja Rp200.000", time: "2 jam lalu" },
  { title: "Katalog produk terbaru sudah tersedia", time: "1 hari lalu" },
];

export function DashboardShell({
  nav,
  title,
  children,
}: {
  nav: NavEntry[];
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  // Group toggles the user has set explicitly; otherwise groups
  // auto-open when one of their children is the active route.
  const [groupToggles, setGroupToggles] = React.useState<
    Record<string, boolean>
  >({});

  function isGroupOpen(group: NavGroup): boolean {
    if (group.label in groupToggles) return groupToggles[group.label];
    return group.children.some((c) => pathname.startsWith(c.href));
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-house text-snow">
      <div className="flex items-center justify-between p-5">
        <Link href="/" aria-label="NOVA — Beranda">
          <NovaLogo onDark compact />
        </Link>
        <button
          className="press rounded-full p-1.5 text-snow-soft hover:bg-white/10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup sidebar"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label={title}>
        <ul className="flex flex-col gap-1">
          {nav.map((entry) => {
            if (isGroup(entry)) {
              const open = isGroupOpen(entry);
              const childActive = entry.children.some((c) =>
                pathname.startsWith(c.href)
              );
              return (
                <li key={entry.label}>
                  <button
                    onClick={() =>
                      setGroupToggles((t) => ({ ...t, [entry.label]: !open }))
                    }
                    aria-expanded={open}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                      childActive
                        ? "text-snow"
                        : "text-snow-soft hover:bg-white/8 hover:text-snow"
                    )}
                  >
                    <entry.icon className="size-4.5 shrink-0" />
                    {entry.label}
                    <ChevronDown
                      className={cn(
                        "ml-auto size-4 transition-transform",
                        open && "rotate-180"
                      )}
                    />
                  </button>
                  {open && (
                    <ul className="mt-0.5 flex flex-col gap-0.5 pl-9">
                      {entry.children.map((child) => {
                        const active = child.exact
                          ? pathname === child.href
                          : pathname.startsWith(child.href);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setSidebarOpen(false)}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                active
                                  ? "bg-accent font-semibold text-snow"
                                  : "text-snow-soft hover:bg-white/8 hover:text-snow"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const active = entry.exact
              ? pathname === entry.href
              : pathname.startsWith(entry.href);
            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-snow"
                      : "text-snow-soft hover:bg-white/8 hover:text-snow"
                  )}
                >
                  <entry.icon className="size-4.5 shrink-0" />
                  {entry.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="press flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-snow-soft transition-colors hover:bg-white/8 hover:text-snow"
        >
          <LogOut className="size-4.5" />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-canvas">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/55"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-canvas/85 px-4 shadow-nav backdrop-blur-md md:px-6">
          <button
            className="press rounded-full p-2 text-ink hover:bg-black/5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka sidebar"
          >
            <Menu className="size-5" />
          </button>

          <h1 className="truncate text-base font-semibold text-brand md:text-lg">
            {title}
          </h1>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
              className="press hidden rounded-full p-2.5 text-ink-soft hover:bg-black/5 hover:text-ink sm:block"
            >
              {isFullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Notifikasi"
                  className="press relative rounded-full p-2.5 text-ink-soft hover:bg-black/5 hover:text-ink"
                >
                  <Bell className="size-5" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                {dummyNotifications.map((n) => (
                  <DropdownMenuItem key={n.title} className="flex-col items-start gap-0.5">
                    <span className="font-medium">{n.title}</span>
                    <span className="text-xs text-ink-soft">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="press flex items-center gap-2.5 rounded-full p-1 pr-3 hover:bg-black/5"
                  aria-label="Menu profil"
                >
                  <span
                    className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-snow"
                    style={{ backgroundColor: user?.avatarColor ?? "#006241" }}
                  >
                    {user?.name?.charAt(0) ?? "N"}
                  </span>
                  <span className="hidden text-left md:block">
                    <span className="block max-w-32 truncate text-sm font-semibold leading-tight text-ink">
                      {user?.name}
                    </span>
                    <span className="block text-xs leading-tight text-ink-soft">
                      {user?.tier}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="normal-case tracking-normal">
                  <span className="block text-sm font-semibold text-ink">{user?.name}</span>
                  <span className="block text-xs font-normal text-ink-soft">{user?.email}</span>
                  {user?.tier === "Mitra Prioritas" && (
                    <Badge variant="gold" className="mt-1.5">★ Mitra Prioritas</Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>

        <footer className="px-6 pb-5 pt-2">
          <p className="flex items-center gap-1.5 text-xs text-ink-soft">
            <NovaMark className="size-4" /> NOVA OFFICIAL &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
