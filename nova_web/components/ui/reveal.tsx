import * as React from "react";
import { cn } from "@/lib/utils";

/*
  Scroll reveal via CSS scroll-driven animation (see `reveal` utility in
  globals.css). Content is always visible by default — no JS, no
  IntersectionObserver — so crawlers, reduced-motion users, and older
  browsers simply see the content without the entrance effect.
*/
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  /** kept for call-site compatibility; staggering is handled by the scroll timeline */
  delay?: number;
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
