import Link from "next/link";
import { NovaLogo } from "@/components/brand/logo";
import { site } from "@/lib/site";

const quickLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang Nova", href: "#nova" },
  { label: "Produk", href: "#produk" },
  { label: "Peluang Usaha", href: "#peluang" },
  { label: "Cara Bergabung", href: "#bergabung" },
];

export function Footer() {
  return (
    <footer className="bg-house pb-8 pt-16 text-snow">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[2fr_1fr_1fr] md:px-6">
        <div>
          <NovaLogo onDark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-snow-soft">
            {site.description}
          </p>
        </div>

        <nav aria-label="Menu cepat">
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Menu Cepat
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-snow-soft transition-colors hover:text-snow"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/register"
                className="text-sm text-snow-soft transition-colors hover:text-snow"
              >
                Registrasi
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gold">
            Kontak
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-snow-soft">
            <li>{site.contact.address}</li>
            <li>
              <a
                href={site.contact.whatsappLink}
                className="transition-colors hover:text-snow"
              >
                {site.contact.whatsapp}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-snow"
              >
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-4 pt-6 md:px-6">
        <p className="text-xs text-snow-soft">
          &copy; {new Date().getFullYear()} {site.name}. Seluruh hak cipta
          dilindungi.
        </p>
      </div>
    </footer>
  );
}
