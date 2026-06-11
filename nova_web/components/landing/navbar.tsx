"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NovaLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Beranda", href: "#beranda" },
  { label: "Nova", href: "#nova" },
  { label: "Produk", href: "#produk" },
  { label: "Peluang Usaha", href: "#peluang" },
  { label: "Cara Bergabung", href: "#bergabung" },
  { label: "Kontak", href: "#kontak" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all",
        scrolled
          ? "bg-canvas/85 shadow-nav backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" aria-label="NOVA Official — Beranda">
          <NovaLogo compact />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {menu.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-black/5 hover:text-brand"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="dark" size="sm">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild variant="black" size="sm">
            <Link href="/register">Registrasi</Link>
          </Button>
        </div>

        <button
          className="press rounded-full p-2 text-ink hover:bg-black/5 lg:hidden"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-canvas/95 px-4 pb-6 pt-2 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col">
            {menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-black/5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2 px-3">
            <Button asChild variant="dark" className="flex-1">
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild variant="black" className="flex-1">
              <Link href="/register">Registrasi</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
