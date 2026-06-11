import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Every button is a full pill with the signature scale(0.95) press —
// variants map 1:1 to docs/DESIGN.MD button inventory.
const buttonVariants = cva(
  "press inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-accent text-snow border border-accent hover:bg-brand hover:border-brand",
        outline: "bg-transparent text-accent border border-accent hover:bg-mint/40",
        black: "bg-black text-snow border border-black hover:bg-house hover:border-house",
        dark: "bg-transparent text-ink border border-ink/87 hover:bg-black/5",
        inverted: "bg-card text-accent border border-card hover:bg-mint",
        "outline-dark": "bg-transparent text-snow border border-snow hover:bg-white/10",
        ghost: "bg-transparent text-ink border border-transparent hover:bg-black/5",
        danger: "bg-danger text-snow border border-danger hover:opacity-90",
      },
      size: {
        sm: "px-4 py-1.5 text-sm",
        default: "px-5 py-2 text-sm",
        lg: "px-7 py-3 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
