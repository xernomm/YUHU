"use client";

import * as React from "react";
import { UserCheck } from "lucide-react";
import { storage } from "@/lib/storage";
import type { User } from "@/lib/types";
import { useLocalData } from "@/lib/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { MemberTable } from "@/components/admin/member-table";

export default function AdminActivationsPage() {
  const [data, reload] = useLocalData(() =>
    storage.getUsers().filter((u) => u.role === "member" && !u.isActive)
  );
  const pending = data ?? [];
  const [activatedName, setActivatedName] = React.useState("");

  function activate(user: User) {
    storage.updateUser({ ...user, isActive: true });
    setActivatedName(user.name);
    reload();
    setTimeout(() => setActivatedName(""), 2500);
  }

  if (data !== null && pending.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        {activatedName && (
          <p className="mb-4 rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
            {activatedName} berhasil diaktivasi.
          </p>
        )}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="rounded-full bg-mint p-5 text-brand">
              <UserCheck className="size-8" />
            </span>
            <h2 className="text-xl font-semibold text-ink">
              Tidak ada member yang menunggu aktivasi
            </h2>
            <p className="text-sm text-ink-soft">
              Semua member sudah aktif. Kerja bagus!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-4 text-ink-soft">
        {pending.length} member menunggu aktivasi dari admin.
      </p>
      {activatedName && (
        <p className="mb-4 rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand">
          {activatedName} berhasil diaktivasi.
        </p>
      )}
      <MemberTable users={pending} onActivate={activate} />
    </div>
  );
}
