"use client";

import * as React from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NovaMark } from "@/components/brand/logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaRegister() {
  const [installEvent, setInstallEvent] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          // SW is progressive enhancement — app works fine without it.
        });
      } else {
        // Dev: a lingering SW serves stale chunks (dev chunk URLs are not
        // content-hashed). Unregister and drop its caches.
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => regs.forEach((r) => r.unregister()))
          .catch(() => {});
        if ("caches" in window) {
          caches
            .keys()
            .then((keys) =>
              keys.forEach((k) => k.startsWith("nova-") && caches.delete(k))
            )
            .catch(() => {});
        }
      }
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      if (window.sessionStorage.getItem("nova:install-dismissed")) return;
      setInstallEvent(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!installEvent || dismissed) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-card bg-card p-4 shadow-card-hover sm:inset-x-auto sm:right-6">
      <div className="flex items-start gap-3">
        <NovaMark className="h-10 w-10 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Pasang aplikasi NOVA</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            Akses katalog dan dashboard lebih cepat dari layar utama Anda.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={async () => {
                await installEvent.prompt();
                setInstallEvent(null);
              }}
            >
              <Download /> Pasang
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                window.sessionStorage.setItem("nova:install-dismissed", "1");
                setDismissed(true);
              }}
            >
              Nanti saja
            </Button>
          </div>
        </div>
        <button
          aria-label="Tutup"
          onClick={() => {
            window.sessionStorage.setItem("nova:install-dismissed", "1");
            setDismissed(true);
          }}
          className="press ml-auto rounded-full p-1 text-ink-soft hover:bg-black/5"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
