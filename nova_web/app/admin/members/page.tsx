"use client";

import { storage } from "@/lib/storage";
import { useLocalData } from "@/lib/hooks";
import { MemberTable } from "@/components/admin/member-table";

export default function AdminMembersPage() {
  const [users] = useLocalData(() =>
    storage.getUsers().filter((u) => u.role === "member")
  );

  return (
    <div className="mx-auto max-w-6xl">
      <p className="mb-4 text-ink-soft">
        Seluruh profil member Nova — cari, filter, dan tinjau statusnya.
      </p>
      <MemberTable users={users ?? []} />
    </div>
  );
}
