"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { heroSlides } from "@/lib/data/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const slide = heroSlides[index];

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      AUTOPLAY_MS
    );
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      id="beranda"
      className="bg-canvas pt-24 md:pt-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 md:grid-cols-[3fr_2fr] md:px-6 md:pb-24">
        {/* Content crate — 60 */}
        <div className="order-2 min-h-[280px] md:order-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">
                {slide.eyebrow}
              </p>
              <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight text-brand md:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
                {slide.body}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">Daftar Sekarang</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Masuk</Link>
            </Button>
          </div>

          {/* Dots */}
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Slide hero">
            {heroSlides.map((s, i) => (
              <button
                key={s.eyebrow}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.eyebrow}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-8 bg-accent" : "w-2 bg-black/15 hover:bg-black/25"
                )}
              />
            ))}
          </div>
        </div>

        {/* Header crate — 40 */}
        <div className="order-1 md:order-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-card bg-ceramic shadow-card"
            >
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 90vw, 380px"
                className="object-cover transition-opacity duration-300 ease-in"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
