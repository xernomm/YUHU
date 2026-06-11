"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Styled native select — for short option lists.
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-black/15 bg-card px-3 pr-9 text-sm text-ink outline-none transition-colors",
          "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-mint",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
    </div>
  );
}

// Searchable select — used for the bank picker in member onboarding.
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  id,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-black/15 bg-card px-3 text-sm outline-none transition-colors",
          "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-mint",
          value ? "text-ink" : "text-ink-soft/70"
        )}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 text-ink-soft transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl bg-card shadow-card-hover">
          <div className="flex items-center gap-2 border-b border-black/8 px-3 py-2">
            <Search className="size-4 shrink-0 text-ink-soft" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/70"
            />
          </div>
          <ul role="listbox" className="max-h-52 overflow-y-auto p-1.5">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-soft">
                Tidak ditemukan. Coba kata kunci lain.
              </li>
            )}
            {filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-mint/60 hover:text-brand",
                    option === value && "font-semibold text-brand"
                  )}
                >
                  {option}
                  {option === value && <Check className="size-4" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { Select, SearchableSelect };
