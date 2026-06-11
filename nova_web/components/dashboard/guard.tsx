"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/types";
import { NovaMark } from "@/components/brand/logo";

// Client-side route guard — mock auth lives entirely in the browser.
export function AuthGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuthStore();

  React.useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== role) {
      router.replace(user.role === "admin" ? "/admin" : "/member");
    }
  }, [hydrated, user, role, router, pathname]);

  if (!hydrated || !user || user.role !== role) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-canvas">
        <NovaMark className="size-12 animate-pulse" />
        <p className="text-sm text-ink-soft">Memuat…</p>
      </div>
    );
  }

  return <>{children}</>;
}
