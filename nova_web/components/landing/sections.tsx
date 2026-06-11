import Link from "next/link";
import { MapPin, MessageCircle, Mail } from "lucide-react";
import {
  aboutNova,
  valueCards,
  opportunities,
  joinSteps,
} from "@/lib/data/content";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ---------- Tentang Nova — white content zone ---------- */

export function AboutSection() {
  return (
    <section id="nova" className="bg-card py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">
            Tentang Nova
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
            {aboutNova.lead}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="flex h-full flex-col justify-center gap-5 text-lg leading-relaxed text-ink-soft">
            <p>{aboutNova.body}</p>
            <p className="border-l-4 border-mint pl-4 font-medium text-uplift">
              {aboutNova.vision}
            </p>
          </div>
        </Reveal>
      </div>

      {/* 3 value cards — quiet Neutral Cool containers on the white zone */}
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 px-4 sm:grid-cols-3 md:px-6">
        {valueCards.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.1}>
            <Card className="h-full border border-black/6 bg-cool shadow-none transition-shadow hover:shadow-card-hover">
              <CardContent className="p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-mint text-base font-bold text-brand">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {card.body}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Peluang Usaha — dark house-green feature band ---------- */

export function OpportunitySection() {
  return (
    <section id="peluang" className="bg-house py-16 text-snow md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-mint">
            Peluang Usaha
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Semua yang Anda butuhkan untuk mulai berjualan, sudah disiapkan.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((item, i) => (
            <Reveal key={item} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-card bg-uplift/60 p-6 transition-colors hover:bg-uplift">
                <span className="text-sm font-bold tracking-[0.2em] text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-base font-medium leading-relaxed text-snow">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cara Bergabung — cream timeline ---------- */

export function JoinStepsSection() {
  return (
    <section id="bergabung" className="bg-canvas py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">
            Cara Bergabung
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
            Empat langkah menuju usaha Anda sendiri
          </h2>
        </Reveal>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-4">
          {/* connector line on md+ */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-black/10 md:block"
          />
          {joinSteps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <li className="relative">
                <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-accent text-base font-bold text-snow shadow-card">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- CTA Registrasi — big house-green band ---------- */

export function CtaSection() {
  return (
    <section className="bg-house py-20 text-snow md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.15]">
            Siap mulai? Bangun usaha Anda sekarang bersama Nova.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-snow-soft">
            Bergabung hari ini dan dapatkan akses ke katalog produk, sistem
            order, serta jaringan kemitraan Nova.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="inverted">
              <Link href="/register">Registrasi</Link>
            </Button>
            <Button asChild size="lg" variant="outline-dark">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Kontak — cream utility zone ---------- */

export function ContactSection() {
  return (
    <section id="kontak" className="bg-canvas py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">
            Kontak
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
            Ada pertanyaan? Hubungi kami.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-[2fr_3fr]">
          <div className="flex flex-col gap-5">
            <Reveal delay={0.05}>
              <Card>
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="rounded-full bg-mint p-2.5 text-brand">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">Alamat</h3>
                    <p className="mt-1 text-sm text-ink-soft">
                      {site.contact.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card>
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="rounded-full bg-mint p-2.5 text-brand">
                    <MessageCircle className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">WhatsApp</h3>
                    <a
                      href={site.contact.whatsappLink}
                      className="mt-1 block text-sm text-accent underline-offset-2 hover:underline"
                    >
                      {site.contact.whatsapp}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.15}>
              <Card>
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="rounded-full bg-mint p-2.5 text-brand">
                    <Mail className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">Email</h3>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="mt-1 block text-sm text-accent underline-offset-2 hover:underline"
                    >
                      {site.contact.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          {/* Google Maps placeholder */}
          <Reveal delay={0.1} className="h-full">
            <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-card border border-dashed border-black/15 bg-ceramic p-8 text-center">
              <MapPin className="size-10 text-uplift" />
              <p className="font-semibold text-ink">Google Maps</p>
              <p className="max-w-xs text-sm text-ink-soft">
                Embed peta lokasi kantor Nova akan ditampilkan di sini.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
