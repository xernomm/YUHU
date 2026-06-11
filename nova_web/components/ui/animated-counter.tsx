"use client";

import * as React from "react";
import { animate, useInView } from "framer-motion";

export function AnimatedCounter({
  to,
  duration = 1.6,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  React.useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString("id-ID");
      },
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
