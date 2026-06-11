import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-lg border border-black/15 bg-card px-3 text-sm text-ink placeholder:text-ink-soft/70 transition-colors outline-none",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-mint",
        "aria-invalid:border-danger aria-invalid:bg-[hsl(4_82%_43%/5%)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border border-black/15 bg-card p-3 text-sm text-ink placeholder:text-ink-soft/70 transition-colors outline-none",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-mint",
        "aria-invalid:border-danger aria-invalid:bg-[hsl(4_82%_43%/5%)]",
        className
      )}
      {...props}
    />
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-bold uppercase tracking-[0.025em] text-ink",
        className
      )}
      {...props}
    />
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-danger">{message}</p>;
}

export { Input, Textarea, Label, FieldError };
