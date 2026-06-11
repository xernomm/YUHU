"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Clock, Package } from "lucide-react";
import { storage } from "@/lib/storage";
import { products } from "@/lib/data/products";
import { useLocalData } from "@/lib/hooks";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Card, CardContent } from "@/components/ui/card";
import { MemberTable } from "@/components/admin/member-table";

export default function AdminDashboardPage() {
  const [data] = useLocalData(() =>
    storage.getUsers().filter((u) => u.role === "member")
  );
  const users = React.useMemo(() => data ?? [], [data]);

  const stats = [
    { label: "Total Member", value: users.length, icon: Users },
    {
      label: "Total Aktif",
      value: users.filter((u) => u.isActive).length,
      icon: UserCheck,
    },
    {
      label: "Total Pending",
      value: users.filter((u) => !u.isActive).length,
      icon: Clock,
    },
    { label: "Total Produk", value: products.length, icon: Package },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <Card className="h-full">
              <CardContent className="p-5">
                <span className="inline-flex rounded-full bg-mint p-2 text-brand">
                  <stat.icon className="size-5" />
                </span>
                <p className="mt-3 text-3xl font-bold tracking-tight text-brand">
                  <AnimatedCounter to={stat.value} duration={1} />
                </p>
                <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-ink-soft">
          Tabel Member
        </h2>
        <MemberTable users={users} />
      </section>
    </div>
  );
}
