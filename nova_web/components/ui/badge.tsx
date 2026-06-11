import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-bold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-mint text-brand",
        brand: "border-transparent bg-brand text-snow",
        accent: "border-transparent bg-accent text-snow",
        // gold = reward ceremony only (Mitra Prioritas, discount stars)
        gold: "border-gold bg-transparent text-gold",
        outline: "border-black/15 bg-transparent text-ink-soft",
        danger: "border-transparent bg-danger/10 text-danger",
        warning: "border-transparent bg-warning/15 text-[#8a6d00]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
