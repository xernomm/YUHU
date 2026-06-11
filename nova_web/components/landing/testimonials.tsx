"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/content";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [index, setIndex] = React.useState(0);
  const item = testimonials[index];

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  React.useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent">
          Testimoni
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
          Kata mereka yang sudah bergabung
        </h2>

        <div className="relative mt-12 min-h-44">
          <Quote
            aria-hidden
            className="absolute -top-2 left-1/2 size-9 -translate-x-1/2 text-mint"
            fill="currentColor"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="px-6 pt-10"
            >
              <blockquote className="text-xl font-medium leading-relaxed text-ink md:text-2xl">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <span className="font-semibold text-brand">{item.name}</span>
                <span className="text-ink-soft"> — {item.role}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Testimoni sebelumnya"
            className="press rounded-full border border-black/15 p-2.5 text-ink hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                aria-label={`Testimoni ${t.name}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-8 bg-accent" : "w-2 bg-black/15"
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Testimoni berikutnya"
            className="press rounded-full border border-black/15 p-2.5 text-ink hover:border-accent hover:text-accent"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
