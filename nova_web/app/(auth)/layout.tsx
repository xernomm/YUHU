import Link from "next/link";
import { NovaLogo } from "@/components/brand/logo";
import { site } from "@/lib/site";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[2fr_3fr]">
      {/* Brand band */}
      <aside className="hidden flex-col justify-between bg-house p-10 text-snow lg:flex">
        <Link href="/" aria-label="Kembali ke beranda">
          <NovaLogo onDark />
        </Link>
        <div>
          <h2 className="max-w-sm text-3xl font-semibold leading-snug tracking-tight">
            Produk berkualitas tinggi &amp; peluang usaha mandiri.
          </h2>
          <p className="mt-4 max-w-sm text-snow-soft">
            Satu akun untuk katalog produk, sistem order, dan jaringan
            kemitraan Nova.
          </p>
        </div>
        <p className="text-xs text-snow-soft">
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </aside>

      {/* Form area */}
      <main className="flex items-center justify-center bg-canvas p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 inline-block lg:hidden" aria-label="Kembali ke beranda">
            <NovaLogo compact />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
