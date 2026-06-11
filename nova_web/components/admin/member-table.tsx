"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Search, UserCheck } from "lucide-react";
import type { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const PAGE_SIZE = 5;

export function MemberTable({
  users,
  onActivate,
}: {
  users: User[];
  onActivate?: (user: User) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tierFilter, setTierFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? u.isActive : !u.isActive);
    const matchTier = tierFilter === "all" || u.tier === tierFilter;
    return matchQuery && matchStatus && matchTier;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      {/* Search & filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama, username, atau email…"
            className="pl-9"
            aria-label="Cari member"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="sm:w-44"
          aria-label="Filter status"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="pending">Belum Aktif</option>
        </Select>
        <Select
          value={tierFilter}
          onChange={(e) => {
            setTierFilter(e.target.value);
            setPage(1);
          }}
          className="sm:w-48"
          aria-label="Filter tier"
        >
          <option value="all">Semua Tier</option>
          <option value="Member">Member</option>
          <option value="Affiliator">Affiliator</option>
          <option value="Reseller">Reseller</option>
          <option value="Mitra Prioritas">Mitra Prioritas</option>
        </Select>
      </div>

      <div className="mt-4 rounded-card bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Member</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bergabung</TableHead>
              {onActivate && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={onActivate ? 6 : 5}
                  className="py-10 text-center text-ink-soft"
                >
                  Tidak ada member yang cocok dengan pencarian Anda.
                </TableCell>
              </TableRow>
            )}
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <span className="flex items-center gap-3">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-snow"
                      style={{ backgroundColor: u.avatarColor }}
                    >
                      {u.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-semibold">{u.name}</span>
                      <span className="block text-xs text-ink-soft">
                        @{u.username} • {u.referralCode}
                      </span>
                    </span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="block text-sm">{u.email}</span>
                  <span className="block text-xs text-ink-soft">{u.phone}</span>
                </TableCell>
                <TableCell>
                  {u.tier === "Mitra Prioritas" ? (
                    <Badge variant="gold">★ {u.tier}</Badge>
                  ) : (
                    <Badge variant="outline">{u.tier}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {u.isActive ? (
                    <Badge variant="accent">Aktif</Badge>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-ink-soft">
                  {new Date(u.joinedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                {onActivate && (
                  <TableCell className="text-right">
                    {!u.isActive && (
                      <Button size="sm" onClick={() => onActivate(u)}>
                        <UserCheck /> Aktifkan
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-black/6 px-4 py-3">
          <p className="text-xs text-ink-soft">
            Menampilkan {rows.length} dari {filtered.length} member
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Halaman sebelumnya"
              className="press rounded-full border border-black/15 p-1.5 text-ink disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-semibold text-ink">
              {safePage} / {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
              aria-label="Halaman berikutnya"
              className="press rounded-full border border-black/15 p-1.5 text-ink disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
